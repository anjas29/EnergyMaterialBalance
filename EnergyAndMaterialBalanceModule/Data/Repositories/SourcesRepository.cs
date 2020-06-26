using EnergyAndMaterialBalanceModule.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class SourcesRepository : BaseRepository<Sources, SEICBalanceContext>, ISourcesRepository
    {
        public SourcesRepository(SEICBalanceContext context) : base(context)
        {
        }
    }
}
