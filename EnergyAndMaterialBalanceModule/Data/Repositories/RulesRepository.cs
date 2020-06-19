using EnergyAndMaterialBalanceModule.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class RulesRepository : BaseRepository<Rules, SEICBalanceContext>, IRulesRepository
    {
        public RulesRepository(SEICBalanceContext context) : base(context)
        {

        }

        public async Task<Rules> GetRule(int pointId)
        {
            return await Context.Rules.Where(t => t.PointId == pointId).Include(t => t.Point).FirstOrDefaultAsync();

        }
    }
}