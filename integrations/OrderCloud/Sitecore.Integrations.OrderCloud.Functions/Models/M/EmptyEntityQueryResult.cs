using System.Collections.Generic;

using Stylelabs.M.Sdk.Contracts.Base;
using Stylelabs.M.Sdk.Contracts.Querying;
using Stylelabs.M.Sdk.Contracts.Querying.Generic;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.M
{
    public class EmptyEntityQueryResult : IEntityQueryResult
    {
        IList<IEntity> IQueryResult<IEntity>.Items => new List<IEntity>();

        public long TotalNumberOfResults => 0;

        public long Offset { get; set; }

        IList<object> IQueryResult.Items => new List<object>();

        public IEntityIterator CreateIterator()
        {
            return new EmptyEntityIterator();
        }
    }
}
