using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EnergyAndMaterialBalanceModule.Models;
using EnergyAndMaterialBalanceModule.Data.Repositories;
using Microsoft.AspNetCore.Http;
using EnergyAndMaterialBalanceModule.Models.Form;

namespace EnergyAndMaterialBalanceModule.Controllers
{
    [Route("main")]
    public class MainController : Controller
    {
        private readonly ILogger<MainController> _logger;
        private readonly IResourcesRepository _resourceRepository;
        private readonly IBGroupsRepository _bgroupsRepository;
        private readonly IPointsRepository _pointsRepository;
        private readonly ISourcesRepository _sourcesRepository;
        private readonly IPeriodsRepository _periodsRepository;
        private readonly IRulesRepository _rulesRepository;
        private readonly IPruleRepository _pruleRepository;
        private readonly ISeicVMappingHistorianRepository _seicVMappingHistorianRepository;
        private readonly ISeicVMappingItehRepository _seicVMappingItehRepository;
        private readonly ISeicVMappingManualRepository _seicVMappingManualRepository;


        private ResultDto _result = new ResultDto();

        public MainController(ILogger<MainController> logger, IResourcesRepository resourceRepository,
            IBGroupsRepository bgroupsRepository, IPointsRepository pointsRepository,
            ISourcesRepository sourcesRepository, IPeriodsRepository periodsRepository,
            IPruleRepository pruleRepository, IRulesRepository rulesRepository,
            ISeicVMappingHistorianRepository seicVMappingHistorianRepository,
            ISeicVMappingItehRepository seicVMappingItehRepository,
            ISeicVMappingManualRepository seicVMappingManualRepository)
        {
            _logger = logger;
            _resourceRepository = resourceRepository;
            _bgroupsRepository = bgroupsRepository;
            _pointsRepository = pointsRepository;
            _sourcesRepository = sourcesRepository;
            _periodsRepository = periodsRepository;
            _pruleRepository = pruleRepository;
            _rulesRepository = rulesRepository;
            _seicVMappingHistorianRepository = seicVMappingHistorianRepository;
            _seicVMappingItehRepository = seicVMappingItehRepository;
            _seicVMappingManualRepository = seicVMappingManualRepository;
        }

        [Route("")]
        [Route("index")]
        [Route("~/")]
        public async Task<IActionResult> Index()
        {
            IEnumerable<Resources> resources = await _resourceRepository.GetAllResources();
            ViewData["Resources"] = resources;

            return View();
        }

        [Route("getBGroups/{resourceId}")]
        public async Task<IActionResult> GetBGroups(int resourceId)
        {
            var selectedResource = await _resourceRepository.GetById((short)resourceId);
            _result.SelectedResource = selectedResource;
            IEnumerable<Bgroups> rootBGroups = await _bgroupsRepository.GetRootBGroups(resourceId);
            foreach (var group in rootBGroups)
            {
                await _bgroupsRepository.GetAllChildren(group.BgroupId);
            }
            _result.Bgroups = rootBGroups;

            return new JsonResult(_result);
        }

        [Route("getPoints/{bgroupId}")]
        public async Task<IActionResult> GetPoints(int bgroupId)
        {
            var selectedBGroup = await _bgroupsRepository.GetById(bgroupId);
            _result.SelectedBGroup = selectedBGroup;
            _result.Points = await _pointsRepository.GetAllPoints(selectedBGroup.BgroupId);
            _result.Sources = _sourcesRepository.GetAll().ToList();
            _result.Periods = _periodsRepository.GetAll().ToList();
            _result.SeicVMappingHistorian = _seicVMappingHistorianRepository.GetAll().ToList();
            _result.SeicVMappingIteh = _seicVMappingItehRepository.GetAll().ToList();
            _result.SeicVMappingManual = _seicVMappingManualRepository.GetAll().ToList();

            return new JsonResult(_result);
        }

        [HttpDelete]
        [Route("deleteBGroup/{bgroupId}")]
        public async Task<IActionResult> DeleteBGroup(int bgroupId)
        {
            var selectedBGroup = await _bgroupsRepository.GetById(bgroupId);
            _result.SelectedBGroup = selectedBGroup;
            await _bgroupsRepository.DeleteWithDependent(bgroupId);

            return new JsonResult(_result);
        }

        [HttpDelete]
        [Route("deletePoint/{pointId}")]
        public async Task<IActionResult> DeletePoint(int pointId)
        {
            var selectedPoint = await _pointsRepository.GetById(pointId);
            _result.SelectedPoint = selectedPoint;
            await _pointsRepository.DeleteWithDependent(pointId);
            _result.Points = await _pointsRepository.GetAllPoints(selectedPoint.BgroupId);

            return new JsonResult(_result);
        }


        [HttpPost]
        [Route("createBGroup")]
        public async Task<IActionResult> CreateBgroup([FromBody] Bgroups model)
        {
            await _bgroupsRepository.Create(model);
            _result.SelectedBGroup = model;

            return new JsonResult(_result);
        }

        [HttpPost]
        [Route("updateBGroup")]
        public async Task<IActionResult> UpdateBgroup([FromBody] Bgroups model)
        {
            Bgroups bgroups = await _bgroupsRepository.GetById(model.BgroupId);
            bgroups.BgroupName = model.BgroupName;
            bgroups.ValidDisbalance = model.ValidDisbalance;
            await _bgroupsRepository.Update(bgroups);
            _result.SelectedBGroup = bgroups;

            return new JsonResult(_result);
        }

        [HttpPost]
        [Route("createPoint")]
        public async Task<IActionResult> CreatePoint([FromBody] Points model)
        {
            await _pointsRepository.Create(model);
            _result.SelectedPoint = await _pointsRepository.GetById(model.PointId);
            _result.Points = await _pointsRepository.GetAllPoints(model.BgroupId);

            return new JsonResult(_result);
        }

        [HttpPost]
        [Route("updatePoint")]
        public async Task<IActionResult> UpdatePoint([FromBody] Points model)
        {

            Points point = await _pointsRepository.GetById(model.PointId);
            point.PointName = model.PointName;
            point.ValidMistake = model.ValidMistake;
            point.SourceId = model.SourceId;
            point.PeriodId = model.PeriodId;
            point.Direction = model.Direction;
            point.Tagname = model.Tagname;

            await _pointsRepository.Update(point);

            _result.SelectedPoint = await _pointsRepository.GetById(point.PointId);
            _result.Points = await _pointsRepository.GetAllPoints(point.BgroupId);

            return new JsonResult(_result);
        }


        [Route("getPoint/{pointId}")]
        public async Task<IActionResult> GetPoint(int pointId)
        {
            _result.SelectedPoint = await _pointsRepository.GetById(pointId);

            if (_result.SelectedPoint.Direction.Equals("~")) 
            {
                _result.Formula = await _rulesRepository.GetRule(pointId);
                if (_result.Formula != null)
                {
                    _result.Parameters = await _pruleRepository.GetParameters(_result.Formula.RuleId);
                }
            }

           
            return new JsonResult(_result);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
