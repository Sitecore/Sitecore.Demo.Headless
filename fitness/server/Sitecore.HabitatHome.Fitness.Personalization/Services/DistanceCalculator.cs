using System;
using System.Collections.Generic;
using System.Linq;
using Sitecore.Analytics.Data;
using Sitecore.Analytics.Data.Items;
using Sitecore.Analytics.Patterns;
using Sitecore.Analytics.Tracking;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;

namespace Sitecore.HabitatHome.Fitness.Personalization.Services
{
    public class ProfiledItemDistance
    {
        public ProfiledItemDistance(double distance, double gravity)
        {
            Distance = distance;
            Gravity = gravity;
        }

        public double Distance { get; protected set; }

        public double Gravity { get; protected set; }
    }

    public class ProfiledItem
    {
        private const string trackingFieldName = "__Tracking";

        public ProfiledItem(Item item)
        {
            Item = item;
        }

        public Item Item { get; protected set; }

        public ProfiledItemDistance ProfiledItemCalculation { get; set; }

        public ContentProfile ContentProfile { get; protected set; }

        public void AssignContentProfile(Profile profile, string profileName)
        {
            Field field = Item.Fields[trackingFieldName];
            if (field == null)
            {
                return;
            }

            var trackingField = new TrackingField(field);
            ContentProfile contentProfile = trackingField.Profiles.FirstOrDefault(p => p.Name == profileName);
            if (contentProfile == null || !contentProfile.IsSavedInField)
            {
                return;
            }

            ContentProfile = contentProfile;
        }
    }

    public class DistanceCalculator
    {
        private IPatternDistance calculator;
        private const double minDistance = 0.01d;
        private const double defaultDistance = 10.0d;

        public DistanceCalculator()
        {
            calculator = new SquaredEuclidianDistance();
        }

        public void Calculate(Profile profile, List<ProfiledItem> list, string profileName, ProfileItem profileItem)
        {
            list.ForEach(item => item.AssignContentProfile(profile, profileName));

            var profiledList = list.Where(pi => pi.ContentProfile != null).ToList();

            PatternSpace space = profileItem.PatternSpace;

            var zeroSize = space.Dimensions;
            var zeroDouble = new double[zeroSize];
            for (int i = 0; i < space.Dimensions; i++)
            {
                zeroDouble[i] = 0.0d;
            }

            Pattern zeroPattern = new Pattern(space, zeroDouble);
            Pattern visitorPattern = zeroPattern;

            if (profile != null)
            {
                double[] numArray = new double[space.Dimensions];
                bool calcPercentage = (profileItem.Type.Equals("percentage", StringComparison.InvariantCultureIgnoreCase));
                if (profile.Count > 0 && calcPercentage)
                {
                    double percentageMultiplier = (calcPercentage) ? 100.0d : 1.0d;
                    double total = profile.Total;
                    foreach (var keyValuePair in profile)
                    {
                        numArray[space.GetKeyIndex(keyValuePair.Key)] = (keyValuePair.Value / total) * percentageMultiplier;
                    }
                    var profileType = profileItem.Type;
                    visitorPattern = new Pattern(space, numArray);

                }
                else if (profile.Count > 0)
                {
                    double percentageMultiplier = calcPercentage ? 100.0d : 1.0d;
                    double total = profile.Total;
                    int count = profile.Count;
                    foreach (var keyValuePair in profile)
                    {
                        numArray[space.GetKeyIndex(keyValuePair.Key)] = keyValuePair.Value / count;
                    }
                    var profileType = profileItem.Type;
                    visitorPattern = new Pattern(space, numArray);
                }
            }

            profiledList.ForEach(item => CalculateProfiledItemDistance(calculator, item, profileName, profileItem, visitorPattern));
        }

        private void CalculateProfiledItemDistance(IPatternDistance calculator, ProfiledItem item, string profileName, ProfileItem profileItem, Pattern visitorPattern)
        {
            PatternSpace space = profileItem.PatternSpace;
            Pattern itemPattern = space.CreatePattern(item.ContentProfile);

            double distance = defaultDistance;
            if (visitorPattern != null)
            {
                distance = Math.Sqrt(calculator.GetDistance(visitorPattern, itemPattern));
            }

            var correctedDistance = distance;

            if (correctedDistance < minDistance)
            {
                correctedDistance = minDistance;
            }

            double gravity = 1.0d / (correctedDistance * correctedDistance);

            item.ProfiledItemCalculation = new ProfiledItemDistance(distance, gravity);
        }
    }
}