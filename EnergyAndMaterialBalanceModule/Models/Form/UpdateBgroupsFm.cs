using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Models.Form
{
    public class UpdateBgroupsFm
    {
        public int bgroupId { get; set; }
        public string bgroupName { get; set; }
        public int validDisbalance { get; set; }
    }
}