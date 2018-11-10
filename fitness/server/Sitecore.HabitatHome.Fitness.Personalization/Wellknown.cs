using Sitecore.Data;
using System;

namespace Sitecore.HabitatHome.Fitness.Personalization
{
    public static class Wellknown
    {
        public static class TemplateIds
        {
            public static readonly ID Event = ID.Parse(Guid.Parse("{9F2F1E35-62EF-5618-AD2B-3C2988389F89}"));
        }

        public static class FieldIds
        {
            public static class Events
            {
                public static readonly ID Date = ID.Parse(Guid.Parse("{1A0B22B8-AC4C-59FC-BC97-2133AE8E82D9}"));
            }
        }

        public static class ProfileItemIds
        {
            public static readonly ID SportsProfile = ID.Parse(Guid.Parse("{8B3C8714-83CA-41F1-BBF6-FF260F732AAF}"));
            public static readonly ID AgeGroupProfile = ID.Parse(Guid.Parse("{AD17D2B4-4904-467E-82FE-1CFBFECA2BA5}"));
            public static readonly ID GenderProfile = ID.Parse(Guid.Parse("{EA255590-37EC-4A05-A12F-015F66BE470B}"));
        }
    }
}