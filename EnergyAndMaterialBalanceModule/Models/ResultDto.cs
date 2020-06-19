using System;
using System.Collections.Generic;

namespace EnergyAndMaterialBalanceModule.Models
{
    public class ResultDto
    {
        public ResultDto()
        {
           
        }

        public IEnumerable<Resources> Resources { get; set; }
        public Resources SelectedResource { get; set; }
        public IEnumerable<Bgroups> Bgroups { get; set; }
        public Bgroups SelectedBGroup { get; set; }
        public IEnumerable<Points> Points { get; set; }
        public Points SelectedPoint { get; set; }
        public Rules Formula { get; set; }
        public IEnumerable<Prule> Parameters { get; set; }

        public IEnumerable<Sources> Sources { get; set; }
        public IEnumerable<Periods> Periods { get; set; }
        public IEnumerable<SeicVMappingHistorian> SeicVMappingHistorian { get; set; }
        public IEnumerable<SeicVMappingIteh> SeicVMappingIteh { get; set; }
        public IEnumerable<SeicVMappingManual> SeicVMappingManual { get; set; }


    }
}
