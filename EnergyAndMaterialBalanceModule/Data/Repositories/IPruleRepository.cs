using EnergyAndMaterialBalanceModule.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public interface IPruleRepository : IBaseRepository<Prule>
    {
        Task<IEnumerable<Prule>> GetParameters(int ruleId);
    }
}
