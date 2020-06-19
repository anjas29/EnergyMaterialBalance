using EnergyAndMaterialBalanceModule.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public interface IRulesRepository : IBaseRepository<Rules>
    {
        Task<Rules> GetRule(int pointId);
    }
}
