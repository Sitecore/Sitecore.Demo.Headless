using Sitecore.Data;
using System;

namespace Sitecore.HabitatHome.Fitness.Personalization
{
    public static class Wellknown
    {
        public static class TemplateIds
        {
            public static readonly ID Event = ID.Parse(Guid.Parse("{9F2F1E35-62EF-5618-AD2B-3C2988389F89}"));
            public static readonly ID Product = ID.Parse(Guid.Parse("{F7CFB991-FDCD-5036-A021-29E58A67DA4B}"));
        }

        public static class FieldIds
        {
            public static class Events
            {
                public static readonly ID Date = ID.Parse(Guid.Parse("{1A0B22B8-AC4C-59FC-BC97-2133AE8E82D9}"));
                public static readonly ID Latitude = ID.Parse(Guid.Parse("{330BAD8C-8319-5A15-8FD8-164B8C7021FD}"));
                public static readonly ID Longitude = ID.Parse(Guid.Parse("{8D5D5171-6372-5791-8954-969D52F5BA8A}"));
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