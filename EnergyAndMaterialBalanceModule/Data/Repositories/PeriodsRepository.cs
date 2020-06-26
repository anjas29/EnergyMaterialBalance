using EnergyAndMaterialBalanceModule.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class PeriodsRepository : BaseRepository<Periods, SEICBalanceContext> , IPeriodsRepository
    {
        public PeriodsRepository(SEICBalanceContext context) : base(context)
        {
        }
    }
}
