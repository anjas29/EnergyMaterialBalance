using EnergyAndMaterialBalanceModule.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class PruleRepository : BaseRepository<Prule, SEICBalanceContext>, IPruleRepository
    {
        public PruleRepository(SEICBalanceContext context) : base(context)
        {

        }

        public async Task<IEnumerable<Prule>> GetParameters(int ruleId)
        {
            return await Context.Prule.Where(t => t.RuleId == ruleId).Include(t => t.Rule).ToListAsync();
        }

    }
}
