using System;
using EnergyAndMaterialBalanceModule.Models;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class SeicVMappingManualRepository : BaseRepository<SeicVMappingManual, SEICBalanceContext>, ISeicVMappingManualRepository
    {
        public SeicVMappingManualRepository(SEICBalanceContext context) : base(context)
        {
        }
    }
}
