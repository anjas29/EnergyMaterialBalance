using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EnergyAndMaterialBalanceModule.Models;
using Microsoft.EntityFrameworkCore;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class PointsRepository : BaseRepository<Points, SEICBalanceContext>, IPointsRepository
    {
        public PointsRepository(SEICBalanceContext context) : base(context)
        {
        }

        public override Task<Points> GetById(int id)
        {
            return Context.Points.Where(t => t.PointId == id)
                .Include(c => c.Period)
                .Include(t => t.Source)
                .Include(t => t.Rules)
                .FirstAsync();
        }


        public async Task<IEnumerable<Points>> GetAllPoints(int bgroupId)
        {
            return await Context.Points.Where(t => t.BgroupId == bgroupId).Include(f => f.Source).Include(f => f.Period).ToListAsync();
        }

    }
}
