var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roadRepair = require('role.roadrepair');
var rolewallRepair = require('role.wallrepair');
var roleMiner = require('role.miner');
var roleSpawnHelper = require('role.SpawnHelper');
var roleDefense = require('role.defense');
var roleTower = require('role.tower');
var roleMiner2 = require('role.miner2');
const profiler = require('screeps.profiler');
var roleLinker = require('role.linker');
var roleAttacker = require('role.attacker');
var roleupcrossroom = require('role.upcrossroom');
var roleExtractor = require('role.extractor');
var roleEnergyMover = require('role.energyMover');
var roleRemoteHarvester = require('role.remoteHarvester');
var roleEnergyHauler = require('role.energyHauler');
var roleClaimer = require('role.claimer');
var roleClaimer2 = require('role.claimer2');
var roleClaimer3 = require('role.claimer3');
var roleClaimer4 = require('role.claimer4');
var roleClaimer5 = require('role.claimer5');
var roleClaimer6 = require('role.claimer6');
//var pathCalculator = require('pathCalculator');
var Traveler = require('Traveler');
"use strict";

//enable profiler module
profiler.enable();

module.exports.loop = function () {
    var Inventory = require('inventoryBuilder');
    
    //var controlledRooms = Object.values(Game.rooms).filter(room => room.controller.my);
    var controlledRooms =[];
    for(var name in Game.rooms) {
        if(Game.rooms[name].controller && Game.rooms[name].controller.my ==true){
            controlledRooms.push(Game.rooms[name]);
        }
    }
    //console.log(controlledRooms.length);
	if(Game.time % 25 || !Memory.myRooms)
    {
        var myrooms = [];
        for (var i = 0, len = controlledRooms.length; i < len; i++)
        {
            Memory.myRooms[i] = controlledRooms[i];
            
            myrooms[i] = controlledRooms[i];
        }
    }	
    profiler.wrap(function() {
	
//	if(!(Game.rooms['W62N27'].controller.safeMode) && !(Game.rooms['W62N27'].controller.safeModeCooldown))
//	{
//		Game.rooms['W62N27'].controller.activateSafeMode();
//	}
	for(var name in Memory.creeps)
	{
		if(!Game.creeps[name])
		{
			delete Memory.creeps[name];
		}
	}
  
    global.attackers = []; 
    global.harvesters = []; 
	global.defensers = [];  
	global.upgraders = []; 
	global.builders = []; 
	global.roadrepairers = []; 
	global.wallrepairers = []; 
	global.spawnhelpers = []; 
	global.miners = []; 
	global.miners2 = []; 
	global.linkers = []; 
	global.upcrossers = []; 
	global.extractors = []; 
    global.energyMovers = []; 
    
    global.nbRoadInRoom = [];
    global.nbContainersInRoom = [];
    global.constructsite = [];

    for (var j = 0, len = controlledRooms.length; j < len; j++)
    {
        //console.log(controlledRooms[j].name);
        harvesters[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == controlledRooms[j].name;});
        defensers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'defense' && creep.memory.home.name == controlledRooms[j].name;});
        upgraders[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == controlledRooms[j].name;});
        builders[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == controlledRooms[j].name;});
        roadrepairers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name == controlledRooms[j].name;});
        wallrepairers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == controlledRooms[j].name;});
        spawnhelpers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'spawnhelper' && creep.memory.home.name == controlledRooms[j].name;});
        miners[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == controlledRooms[j].name;});
        miners2[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner2' && creep.memory.home.name == controlledRooms[j].name;});
        linkers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'linker' && creep.memory.home.name == controlledRooms[j].name;});
        upcrossers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == controlledRooms[j].name;});
        extractors[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == controlledRooms[j].name;});
        energyMovers[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == controlledRooms[j].name;});
        nbContainersInRoom[j] = controlledRooms[j].find(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_CONTAINER;
            } 
        });
        nbRoadInRoom[j] = controlledRooms[j].find(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_ROAD;
            } 
        });
        constructsite[j] = controlledRooms[j].find(FIND_CONSTRUCTION_SITES);
    }
    
    global.energyHaulers = [];
    global.remoteHarvesters = [];
    global.numberOfHauler = [];
    global.arrayFlag = [];
    global.destRoom = [];

    numberOfHauler = [3,1,3,3,3,3,1];
    arrayFlag = [Game.flags.remote0, Game.flags.remote1, Game.flags.remote2, Game.flags.remote3, Game.flags.remote4, Game.flags.remote5, Game.flags.remote6];
    destRoom = [Game.rooms['W62N27'], Game.rooms['W62N29'], Game.rooms['W63N28'], Game.rooms['W62N27'], Game.rooms['W63N28'], Game.rooms['W63N27'], Game.rooms['W63N26']];

    for (var k = 0, len = 7; k < len; k++)
    {
        energyHaulers[k] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+k) ;});
        remoteHarvesters[k] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'remoteHarvester' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+k) ;});    
    }
    var energyHaulersTotal = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler';});  

    for (var l = 0,len = energyHaulersTotal.length; l < len; l++)
    {
        if(energyHaulersTotal[l].memory.currentFlag.name == 'remote0' && energyHaulersTotal[l].memory.home != destRoom[0])
        {
            energyHaulersTotal[l].memory.home = destRoom[0];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote1' && energyHaulersTotal[l].memory.home != destRoom[1])
        {
            energyHaulersTotal[l].memory.home = destRoom[1];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote2' && energyHaulersTotal[l].memory.home != destRoom[2])
        {
            energyHaulersTotal[l].memory.home = destRoom[2];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote3' && energyHaulersTotal[l].memory.home != destRoom[3])
        {
            energyHaulersTotal[l].memory.home = destRoom[3];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote4' && energyHaulersTotal[l].memory.home != destRoom[4])
        {
            energyHaulersTotal[l].memory.home = destRoom[4];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote5' && energyHaulersTotal[l].memory.home != destRoom[5])
        {
            energyHaulersTotal[l].memory.home = destRoom[5];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote6' && energyHaulersTotal[l].memory.home != destRoom[6])
        {
            energyHaulersTotal[l].memory.home = destRoom[6];
        }
    }

    
    global.claimers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer';});
    global.claimers2 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer2';});    
    global.claimers3 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer3';});
    global.claimers4 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer4';});
    global.claimers5 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer5';});
    global.claimers6 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer6';});
    attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker';});
    global.tempsers =  _.filter(Game.creeps, function(creep) { return creep.memory.role == 'temp';});
    upcrossers[0] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Game.flags.Flag4.pos.roomName;});
    
    for (var k = 0, len = controlledRooms.length; k < len; k++)
    {
        var currentRoom = controlledRooms[k];
        defendRoom(currentRoom.name);
        funcCreepSpawner(currentRoom,k,nbContainersInRoom,controlledRooms);
    }
    	//This part handle transfer between links
	var linkFrom = controlledRooms[0].lookForAt('structure', 34, 33)[0];
	var link2From = controlledRooms[0].lookForAt('structure', 30, 13)[0];
    var linkTo = controlledRooms[0].lookForAt('structure', 18, 12)[0]; 
    var linkFrom2 = controlledRooms[4].lookForAt('structure', 38, 8)[0];
    var link2From2 = controlledRooms[4].lookForAt('structure', 27, 18)[0];
    var linkTo2 = controlledRooms[4].lookForAt('structure', 31, 22)[0];
    var linkFrom3 =  controlledRooms[2].lookForAt('structure', 42, 40)[0];
    var linkTo3 =  controlledRooms[2].lookForAt('structure', 30, 11)[0];
    
    if(linkFrom && linkTo)
    {
        linkFrom.transferEnergy(linkTo);
    }
    if(link2From && linkTo)
    {
        link2From.transferEnergy(linkTo);
    }
    if(linkFrom2 && linkTo2)
    {
        linkFrom2.transferEnergy(linkTo2);
    }
    if(link2From2 && linkTo2)
    {
        link2From2.transferEnergy(linkTo2);
    }
    if(linkFrom3 && linkTo3)
    {
        linkFrom3.transferEnergy(linkTo3);
    }

    //create reaction between Labs in Room 0
    var labs = controlledRooms[0].find(FIND_MY_STRUCTURES, 
        {filter: {structureType: STRUCTURE_LAB}});
    
    if(labs && labs.length > 2 && labs[1].cooldown == 0 && labs[0].mineralAmount > 0 && labs[2].mineralAmount > 0 && labs[1].mineralAmount < labs[1].mineralCapacity)
    {
        labs[1].runReaction(labs[0], labs[2]);
    }

    for(var name in Game.creeps)
    {
        
        var creep = Game.creeps[name];		
        if(creep.memory.role == 'harvester')
        {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader')
        {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder')
        {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'linker')
        {
            roleLinker.run(creep);
        }	
        else if(creep.memory.role == 'roadrepair')
        {
            roadRepair(creep);
        }
        else if(creep.memory.role == 'wallrepair')
        {
            rolewallRepair(creep);
        }
        else if(creep.memory.role == 'miner')
        {
            roleMiner.run(creep);
        }
        else if(creep.memory.role == 'miner2')
        {
            roleMiner2.run(creep);
        }
        else if(creep.memory.role == 'spawnhelper')
        {
            roleSpawnHelper.run(creep);
        }
        else if(creep.memory.role == 'defense')
        {
            roleDefense(creep);
        }
        else if (creep.memory.role == 'attacker')
        {
            roleAttacker(creep);
        }
        else if (creep.memory.role == 'upcrosser')
        {
            roleupcrossroom(creep);
        }
        else if (creep.memory.role == 'extractor')
        {
            roleExtractor.run(creep);
        }
        else if(creep.memory.role == 'energyMover')
        {
            roleEnergyMover.run(creep);
        }
        else if(creep.memory.role == 'remoteHarvester')
        {
            roleRemoteHarvester(creep);
        } 
        else if(creep.memory.role == 'energyHauler')
        {
            roleEnergyHauler(creep);
        }
        else if(creep.memory.role == 'claimer')
        {
            roleClaimer(creep);
        }
        else if(creep.memory.role == 'claimer2')
        {
            roleClaimer2(creep);
        }
        else if(creep.memory.role == 'claimer3')
        {
            roleClaimer3(creep);
        }
        else if(creep.memory.role == 'claimer4')
        {
            roleClaimer4(creep);
        }
        else if(creep.memory.role == 'claimer5')
        {
            roleClaimer5(creep);
        }
        else if(creep.memory.role == 'claimer6')
        {
            roleClaimer6(creep);
        }
        else if(creep.memory.role == 'temp')
        {
            creep.claimController(creep.room.controller);
            if(creep.pos.roomName != Game.flags.Flag5.pos.roomName)
            {
                creep.travelTo(Game.flags.Flag5);
            }
            else if (!creep.room.controller.my) {
                if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(creep.room.controller);
                }
                else
                {
                    creep.attackController(creep.room.controller);
                }
            }
            else
            {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(creep.room.controller);
                } 
            }
 
            creep.moveTo(Game.flags.Flag5);
            
        }
        if(!creep.memory.home)
        {
            creep.memory.home = creep.room;
        }
    }


    

	/*if(Game.rooms.Room2.controller.ticksToDowngrade < 40000)
	{
	    console.log(Game.rooms.Room2.controller.ticksToDowngrade);
	    Game.notify(`Controller no longer updated - Decay in  ${Game.rooms.Room2.controller.ticksToDowngrade}`);
	}*/
    if(Game.time % 100 ==  0)
    {
        Inventory.update();
    }
    });
}

function funcCreepSpawner(activeRoom, index,nbContainersInRoom,controlledRooms)
{
    var activeSpawns = activeRoom.find(FIND_STRUCTURES, {
        filter: function(object)
            {
                return object.structureType === STRUCTURE_SPAWN;
            } 
    });
    var sources = activeRoom.find(FIND_SOURCES); 

    var ExtractorInRoom = activeRoom.find(FIND_STRUCTURES, {
        filter: function(object)
            {
                return object.structureType === STRUCTURE_EXTRACTOR;
            } 
    });

    if(activeRoom.storage)
    {
        var total = (activeRoom.storage.store[RESOURCE_ENERGY] );
    }
    else
    {
        var total = 0;
    }
    //console.log(activeRoom.name +'   ' + activeRoom.find(FIND_MINERALS)[0].mineralAmount);
    if(activeSpawns.length > 0)
    {
        if(activeSpawns[0].spawning == null)
        {
            if((!upgraders[index] || upgraders[index].length < 1) && ((harvesters[index].length < 2 && sources.length > 1) || (harvesters[index].length < 1 && sources.length == 1))) 
            {   
                if(activeSpawns[0].canCreateCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester', home: activeRoom});
                    console.log('Spawning new harvester ' + activeRoom.name + ': ' + newName);
                    harvesters[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == activeRoom.name;});                    
                }
                else if(activeSpawns[0].canCreateCreep([WORK,CARRY,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'harvester', home: activeRoom});
                    console.log('Spawning new harvester ' + activeRoom.name + ': ' + newName);
                    harvesters[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == activeRoom.name;});                                        
                }
                else if(activeSpawns[0].canCreateCreep([WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester', home: activeRoom});
                    console.log('Spawning new harvester ' + activeRoom.name + ': ' + newName);
                    harvesters[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == activeRoom.name;});                                        
                }
            }
            else if(spawnhelpers[index].length < 2 && nbContainersInRoom[index].length > 0)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'spawnhelper', home: activeRoom});
                    console.log('Spawning new spawnHelper ' + activeRoom.name + ': ' + newName);
                    spawnhelpers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'spawnhelper' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'spawnhelper', home: activeRoom});
                    console.log('Spawning new spawnHelper ' + activeRoom.name + ': ' + newName);
                    spawnhelpers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'spawnhelper' && creep.memory.home.name == activeRoom.name;});
                }	
                else if(activeSpawns[0].canCreateCreep([CARRY,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CARRY,CARRY,MOVE], undefined, {role: 'spawnhelper', home: activeRoom});
                    console.log('Spawning new spawnHelper ' + activeRoom.name + ': ' + newName);
                    spawnhelpers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'spawnhelper' && creep.memory.home.name == activeRoom.name;});
                }	
            }
            else if(miners2[index].length < 1 && nbContainersInRoom[index].length > 0)
            {   
                
                if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]) == OK)
                {	
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'miner2', home: activeRoom});
                    console.log('Spawning new miner2 ' + activeRoom.name + ': ' + newName);
                    miners2[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner2' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'miner2', home: activeRoom});
                    console.log('Spawning new miner2 ' + activeRoom.name + ': ' + newName);
                    miners2[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner2' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'miner2', home: activeRoom});
                    console.log('Spawning new miner2 ' + activeRoom.name + ': ' + newName);
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'miner2', home: activeRoom});
                    console.log('Spawning new miner2 ' + activeRoom.name + ': ' + newName);
                }
            }
            else if(miners[index].length < 1 && nbContainersInRoom[index].length > 0 && sources.length > 1)
            { 
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY], undefined, {role: 'miner', home: activeRoom});
                    console.log('Spawning new miner ' + activeRoom.name + ': ' + newName);
                    miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY], undefined, {role: 'miner', home: activeRoom});
                    console.log('Spawning new miner ' + activeRoom.name + ': ' + newName);
                    miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'miner', home: activeRoom});
                    console.log('Spawning new miner ' + activeRoom.name + ': ' + newName);
                    miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'miner', home: activeRoom});
                    console.log('Spawning new miner ' + activeRoom.name + ': ' + newName);
                    miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'miner', home: activeRoom});
                    console.log('Spawning new miner ' + activeRoom.name + ': ' + newName);
                    miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'miner', home: activeRoom});
                    console.log('Spawning new miner ' + activeRoom.name + ': ' + newName);
                    miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                }   
            }
            else if(energyMovers[index].length < 1 && (nbContainersInRoom[index].length > 1 || activeRoom.storage)) 
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'energyMover', home: activeRoom});
                    console.log('Spawning new energyMover ' + activeRoom.name + ': ' + newName);
                    energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                }
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'energyMover', home: activeRoom});
                    console.log('Spawning new energyMover ' + activeRoom.name + ': ' + newName);
                    energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'energyMover', home: activeRoom});
                    console.log('Spawning new energyMover ' + activeRoom.name + ': ' + newName);
                    energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'energyMover', home: activeRoom});
                    console.log('Spawning new energyMover ' + activeRoom.name + ': ' + newName);
                    energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                }	
                else if(activeSpawns[0].canCreateCreep([CARRY,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CARRY,CARRY,MOVE], undefined, {role: 'energyMover', home: activeRoom});
                    console.log('Spawning new energyMover ' + activeRoom.name + ': ' + newName);
                    energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                }	
            }
            /*else if(Game.flags.Flag4.room && Game.flags.Flag4.room.controller && (!Game.flags.Flag4.room.controller.upgradeBlocked || Game.flags.Flag4.room.controller.upgradeBlocked < 450) && tempsers.length < 1 && !Game.flags.Flag4.room.controller.my)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM,CLAIM,CLAIM]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM,CLAIM,CLAIM], undefined, {role: 'temp', home: activeRoom});
                    console.log('Spawning new temp from ' + activeRoom.name + ': ' + newName)
                
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM], undefined, {role: 'temp', home: activeRoom});
                    console.log('Spawning new temp from ' + activeRoom.name + ': ' + newName)
                
                }
            }*/
            else if (  !upcrossers[0] || (upcrossers[0].length < 0 && Memory.myRooms.length > 6))
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], undefined, {role: 'upcrosser', home:Game.flags.Flag4.room});
                    console.log('Spawning new upcrosser for dest  '+ Game.flags.Flag4.pos.roomName +'  from ' + activeRoom + '  ' + newName)
                    upcrossers[0] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Game.flags.Flag4.room;});
                }
            }
            else if(((((upgraders[index].length < 3 && sources.length > 1) ||(upgraders[index].length < 1 && sources.length == 1) || (upgraders[index].length < 2 && sources.length == 1 && activeRoom.storage) ) && activeRoom.controller.level < 6 ) || (upgraders[index].length < 1 && activeRoom.controller.level > 5)) && nbContainersInRoom[index].length > 0)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY], undefined, {role: 'upgrader', home: activeRoom});
                    console.log('Spawning new upgrader ' + activeRoom.name + ': ' + newName)
                
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY], undefined, {role: 'upgrader', home: activeRoom});
                    console.log('Spawning new upgrader ' + activeRoom.name + ': ' + newName)
                    upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,WORK,CARRY,CARRY], undefined, {role: 'upgrader', home: activeRoom});
                    console.log('Spawning new upgrader ' + activeRoom.name + ': ' + newName)
                    upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader', home: activeRoom});
                    console.log('Spawning new upgrader ' + activeRoom.name + ': ' + newName)
                    upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                }
            }
            else if(builders[index].length < 2 && constructsite.length > 0)
            {
                
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'builder', home: activeRoom});
                    console.log('Spawning new builder ' + activeRoom.name + ': ' + newName);
                    builders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder', home: activeRoom});
                    console.log('Spawning new builder ' + activeRoom.name + ': ' + newName);
                    builders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,WORK,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder', home: activeRoom});
                    console.log('Spawning new builder ' + activeRoom.name + ': ' + newName);
                    builders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == activeRoom.name;});
                }
                
            }
            else if(nbRoadInRoom[index] && (roadrepairers[index].length < 2 && nbRoadInRoom[index].length > 40) || (roadrepairers[index].length < 1 && nbRoadInRoom[index].length < 41))  
            {
    
                if(activeSpawns[0].canCreateCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'roadrepair', Harvest: false, home: activeRoom});
                    console.log('Spawning new roadRepairer ' + activeRoom.name + ': ' + newName);
                    roadrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name == activeRoom.name;}); 
                }
                else if(activeSpawns[0].canCreateCreep([WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'roadrepair', Harvest: false, home: activeRoom});
                    console.log('Spawning new roadRepairer ' + activeRoom.name + ': ' + newName);
                    roadrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name == activeRoom.name;}); 
                }	
            }
            else if(roadrepairers[6].length < 0)
            {
    
                if(activeSpawns[0].canCreateCreep([WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'roadrepair', Harvest: false, home: Memory.myRooms[6]});
                    console.log('Spawning new roadRepairer from: ' + activeRoom.name + ' for dest: ' + Memory.myRooms[6].name + ': ' + newName);
                    roadrepairers[6] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name ==  Memory.myRooms[6].name;});
                }	
            }
            else if(attackers.length < 0)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], undefined, {role: 'attacker',home: activeRoom.name});
                    console.log('Spawning new attacker: ' + newName);
                    attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK], undefined, {role: 'attacker',home: activeRoom.name});
                    console.log('Spawning new attacker: ' + newName);
                    attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker' && creep.memory.home.name == activeRoom.name;});
                }
            }    
            else if(defensers[index].length < 1)
            {
                if(activeSpawns[0].canCreateCreep([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE], undefined, {role: 'defense', home: activeRoom});
                    console.log('Spawning new defenser ' + activeRoom.name + ': ' + newName);
                    defensers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'defense' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([ATTACK,ATTACK,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([ATTACK,ATTACK,MOVE,MOVE], undefined, {role: 'defense', home: activeRoom});
                    console.log('Spawning new defenser ' + activeRoom.name + ': ' + newName);
                    defensers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'defense' && creep.memory.home.name == activeRoom.name;});
                }
            }
            else if(extractors[index].length < 1 && ExtractorInRoom && ExtractorInRoom.length > 0 && activeRoom.find(FIND_MINERALS)[0].mineralAmount > 0)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'extractor', home: activeRoom});
                    console.log('Spawning new extractor ' + activeRoom.name + ': ' + newName);
                    extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY], undefined, {role: 'extractor', home: activeRoom});
                    console.log('Spawning new extractor ' + activeRoom.name + ': ' + newName);
                    extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'extractor', home: activeRoom});
                    console.log('Spawning new extractor ' + activeRoom.name + ': ' + newName);
                    extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'extractor', home: activeRoom});
                    console.log('Spawning new extractor ' + activeRoom.name + ': ' + newName);
                    extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                }
            }
            else if ( (upcrossers[6].length < 2 && Memory.myRooms.length > 6) ||!upcrossers[6])
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], undefined, {role: 'upcrosser', home: Memory.myRooms[6]});
                    console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[6].name +'  from ' + activeRoom + '  ' + newName)
                    upcrossers[6] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[6].name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], undefined, {role: 'upcrosser', home: Memory.myRooms[6]});
                    console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[6].name +'  from ' + activeRoom + '  ' + newName)
                    upcrossers[6] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[6].name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,CARRY,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upcrosser', home: Memory.myRooms[6]});
                    console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[6].name +'  from ' + activeRoom + '  ' + newName)
                    upcrossers[6] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[6].name;});
                }
            }
            else if(wallrepairers[index].length < 1)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
                { 
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY], undefined, {role: 'wallrepair', home: activeRoom});
                    console.log('Spawning new wallRepairer ' + activeRoom.name + ': ' + newName);
                    wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,WORK,CARRY,CARRY]) == OK)
                { 
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,WORK,CARRY,CARRY], undefined, {role: 'wallrepair', home: activeRoom});
                    console.log('Spawning new wallRepairer ' + activeRoom.name + ': ' + newName);
                    wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                }
                if(activeSpawns[0].canCreateCreep([WORK,CARRY,MOVE]) == OK)
                { 
                    var newName = activeSpawns[0].createCreep([WORK,CARRY,MOVE], undefined, {role: 'wallrepair', home: activeRoom});
                    console.log('Spawning new wallRepairer ' + activeRoom.name + ': ' + newName);
                    wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                }
            }
            else if(!builders[6] || (builders[6].length < 2 && constructsite[6] && constructsite[6].length > 0))
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder', home: Memory.myRooms[6]});
                    console.log('Spawning new builder for dest '+ Memory.myRooms[6].name + ' from '+ activeRoom.name +' : ' + newName);
                    builders[6]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[6].name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder', home: Memory.myRooms[6]});
                    console.log('Spawning new builder for dest '+ Memory.myRooms[6].name + ' from '+ activeRoom.name +' : ' + newName);
                    builders[6]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[6].name;});
                }
                else if(activeSpawns[0].canCreateCreep([WORK,CARRY, MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([WORK,CARRY, MOVE], undefined, {role: 'builder', home: Memory.myRooms[6]});
                    console.log('Spawning new builder for dest '+ Memory.myRooms[6].name + ' from '+ activeRoom.name +' : ' + newName);
                    builders[6]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[6].name;});
                }	
            } 
            else if((!claimers || claimers.length < 1 )&& Game.flags.remoteController)
            {
                if(activeSpawns[0].canCreateCreep([CLAIM,CLAIM,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer', home: activeRoom});
                    console.log('Spawning new Claimer from ' + activeRoom.name + ': ' + newName);
                    claimers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer';});
                }
                    
            }
            else if((!claimers2 || claimers2.length < 1 )&& Game.flags.remoteController2)
            {
                if(activeSpawns[0].canCreateCreep([CLAIM,CLAIM,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer2', home: activeRoom});
                    console.log('Spawning new Claimer2 from ' + activeRoom.name + ': ' + newName);
                    claimers2 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer2';});
                }
                    
            }
            else if((!claimers3 || claimers3.length < 1 )&& Game.flags.remoteController3 && activeRoom.name != 'W62N29')
            {
                if(activeSpawns[0].canCreateCreep([CLAIM,CLAIM,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer3', home: activeRoom});
                    console.log('Spawning new Claimer3 from ' + activeRoom.name + ': ' + newName);
                    claimers3 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer3';});
                }                  
            }
            else if((!claimers5 || claimers5.length < 1 )&& Game.flags.remoteController5)
            {
                if(activeSpawns[0].canCreateCreep([CLAIM,CLAIM,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer5', home: activeRoom});
                    console.log('Spawning new Claimer5 from ' + activeRoom.name + ': ' + newName);
                    claimers5 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer5';});
                }                  
            }
            else if((!claimers6 || claimers6.length < 1 )&& Game.flags.remoteController6)
            {
                if(activeSpawns[0].canCreateCreep([CLAIM,CLAIM,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer6', home: activeRoom});
                    console.log('Spawning new Claimer6 from ' + activeRoom.name + ': ' + newName);
                    claimers6 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer6';});
                }                  
            }
            else if((!claimers4 || claimers4.length < 1 )&& Game.flags.remoteController4)
            {
                if(activeSpawns[0].canCreateCreep([CLAIM,CLAIM,MOVE,MOVE]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined, {role: 'claimer4', home: activeRoom});
                    console.log('Spawning new Claimer4 from ' + activeRoom.name + ': ' + newName);
                    claimers4 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer4';});
                }                  
            }
            else if(upgraders[index].length < 4 && total > 50000 && activeRoom.controller.level < 8)
            {
                if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'upgrader', home: activeRoom});
                    console.log('Spawning new upgrader (High storage) ' + activeRoom.name + ': ' + newName)
                    upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                }
                else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                {
                    var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'upgrader', home: activeRoom});
                    console.log('Spawning new upgrader (High storage) ' + activeRoom.name + ': ' + newName)
                    upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                }

            } 
           if(claimers.length > 0 && claimers2.length > 0 && claimers3.length > 0 && claimers4.length > 0  && claimers5.length > 0 && claimers6.length > 0)
           {
                for (var r = 0, len = 7; r < len; r++)
                {
                    if((arrayFlag[r].room && arrayFlag[r].room.controller && arrayFlag[r].room.controller.reservation && arrayFlag[r].room.controller.reservation.username == 'Pimaco' && arrayFlag[r].room.controller.reservation.ticksToEnd > 1700 ) || (arrayFlag[r].room && arrayFlag[r].room.controller.my))
                    {
                        if(remoteHarvesters[r].length < 1 || (remoteHarvesters[r][0].ticksToLive < 270  && remoteHarvesters[r].length < 2))
                        { 
                            if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY]) == OK)
                            {	
                                var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY], undefined, {role: 'remoteHarvester', home: activeRoom, currentFlag: arrayFlag[r] });
                                console.log('Spawning new RemoteHarvester' + r+' from ' + activeRoom.name + ': ' + newName);
                                remoteHarvesters[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'remoteHarvester' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r);});
                                break;
                            }
                        } 
                        else if(energyHaulers[r].length < numberOfHauler[r] )
                        {
                            console.log(arrayFlag[r]);
                            console.log(destRoom[r]);
                            if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                            {
                                var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'energyHauler', home: Game.rooms[destRoom[r]], currentFlag: arrayFlag[r]});
                                console.log('Spawning new energyHauler'+ r + ' from ' + activeRoom.name + ': ' + newName);
                                energyHaulers[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r) ;});
                                break;
                            }
                            else if(activeSpawns[0].canCreateCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]) == OK)
                            {
                                var newName = activeSpawns[0].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: 'energyHauler', home: Game.rooms[destRoom[r]], currentFlag: arrayFlag[r]});
                                console.log('Spawning new energyHauler'+ r + ' from ' + activeRoom.name + ': ' + newName);
                                energyHaulers[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r) ;});
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    

  /*let terminal = activeRoom.terminal;
 
    if(terminal && !terminal.cooldown && (terminal.store[RESOURCE_UTRIUM] || terminal.store[RESOURCE_ZYNTHIUM])) 
    {
        if(terminal.store[RESOURCE_UTRIUM])
        {
            let buyOrders = Game.market.getAllOrders({resourceType: RESOURCE_UTRIUM, type: ORDER_BUY});
            _.sortBy(buyOrders, ['price']);
            var len = buyOrders.length - 1;
            //console.log(buyOrders[len].price);
            Game.market.deal(buyOrders[len].id, terminal.store[RESOURCE_UTRIUM], activeRoom.name);
        }
        else if(terminal.store[RESOURCE_ZYNTHIUM])
        {
            let buyOrders = Game.market.getAllOrders({resourceType: RESOURCE_ZYNTHIUM, type: ORDER_BUY});
            _.sortBy(buyOrders, ['price']);
            var len = buyOrders.length - 1;
            //console.log(buyOrders[len].price);
            Game.market.deal(buyOrders[len].id, terminal.store[RESOURCE_ZYNTHIUM], activeRoom.name);
        }
        //let buyOrders2 = Game.market.getAllOrders({resourceType: RESOURCE_ENERGY, type: ORDER_BUY});
        //_.sortBy(buyOrders2, ['price']);
        //var len2 = buyOrders2.length - 1;
        //console.log(buyOrders2[len2].price);
        //Game.market.deal(buyOrders2[len].id, terminal.store[RESOURCE_ENERGY]/2, activeRoom.name);
    }
    /*if(terminal && !terminal.cooldown && terminal.store.energy) 
    {
        var enerQuantity = terminal.store.energy / 2;
        //Game.market.createOrder(ORDER_, RESOURCE_ENERGY, 0.006, 50000,  activeRoom.name);
    }*/

   // Game.market.createOrder(ORDER_SELL, RESOURCE_GHODIUM_HYDRIDE, 0.723, 2500,  'W62N27');
}

function defendRoom(roomName)
{
	var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
	var towers = Game.rooms[roomName].find( FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
	if(towers)
	{
		if(hostiles.length > 0)
		{
			var username = hostiles[0].owner.username;
			if(username != 'Invader')
			{
				Game.notify(`User ${username} spotted in room ${roomName}`);    
			}
			towers.forEach(tower => tower.attack(hostiles[0]));
        }
        else
        {
            towers.forEach(tower => roleTower(tower));
        }
	}
} 
