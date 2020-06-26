using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EnergyAndMaterialBalanceModule.Models.Form
{
    public class CreateBgroupsFm
    {
        public string bgroupName { get; set; }
        public int validDisbalance { get; set; }
        public int resourceId { get; set; }
        public int? bGroupIdParent { get; set; }
    }
}
