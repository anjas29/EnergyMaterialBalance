using System;
using EnergyAndMaterialBalanceModule.Models;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class SeicVMappingItehRepository : BaseRepository<SeicVMappingIteh, SEICBalanceContext>, ISeicVMappingItehRepository
    {
        public SeicVMappingItehRepository(SEICBalanceContext context) : base(context)
        {
        }
    }
}
