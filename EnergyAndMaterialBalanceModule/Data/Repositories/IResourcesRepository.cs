using System.Collections.Generic;
using System.Threading.Tasks;
using EnergyAndMaterialBalanceModule.Models;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public interface IResourcesRepository: IBaseRepository<Resources>
    {
        Task<IEnumerable<Resources>> GetAllResources();
        Task<Resources> GetById(short id);
    }
}