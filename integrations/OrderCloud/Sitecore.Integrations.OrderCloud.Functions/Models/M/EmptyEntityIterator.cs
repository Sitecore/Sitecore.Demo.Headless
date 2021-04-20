using System.Threading.Tasks;

using Stylelabs.M.Sdk.Contracts.Base;
using Stylelabs.M.Sdk.Contracts.Querying;

namespace Sitecore.Integrations.OrderCloud.Functions.Models.M
{
    public class EmptyEntityIterator : IEntityIterator
    {
        public IEntityQueryResult Current => new EmptyEntityQueryResult();

        object IIterator.Current => Current;

        public bool CanMoveNext()
        {
            return false;
        }

        public bool CanMovePrevious()
        {
            return false;
        }

        public Task<bool> MoveNextAsync()
        {
            return Task.FromResult(false);
        }

        public Task<bool> MovePreviousAsync()
        {
            return Task.FromResult(false);
        }

        public void Reset()
        {
        }
    }
}
