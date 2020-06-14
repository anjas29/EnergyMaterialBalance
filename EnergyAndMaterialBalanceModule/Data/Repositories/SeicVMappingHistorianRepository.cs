using System;
using EnergyAndMaterialBalanceModule.Models;

namespace EnergyAndMaterialBalanceModule.Data.Repositories
{
    public class SeicVMappingHistorianRepository : BaseRepository<SeicVMappingHistorian, SEICBalanceContext>, ISeicVMappingHistorianRepository
    {
        public SeicVMappingHistorianRepository(SEICBalanceContext context) : base(context)
        {
        }
    }
}
