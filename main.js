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
var roleClaimer7 = require('role.claimer7');
var roleClaimer8 = require('role.claimer8');
var roleClaimer9 = require('role.claimer9');
//var pathCalculator = require('pathCalculator');
var Traveler = require('Traveler');
"use strict";

//enable profiler module
profiler.enable();

module.exports.loop = function () {
    var Inventory = require('inventoryBuilder');
    
    //var controlledRooms = Object.values(Game.rooms).filter(room => room.controller.my);
    global.controlledRooms =[];
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
	global.upcrossers = []; 
	global.extractors = []; 
    global.energyMovers = []; 
    
    global.nbRoadInRoom = [];
    global.nbContainersInRoom = [];
    global.constructsite = [];
    global.termTarget = [];

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
        
        if(controlledRooms[j].storage && controlledRooms[j].terminal && controlledRooms[j].controller.level < 8 && controlledRooms[j].storage.store[RESOURCE_ENERGY] < 12000 && _.sum(controlledRooms[j].storage.store) < 250000 && controlledRooms[j].terminal.store[RESOURCE_ENERGY] < 12000)
        {
            termTarget[j] = true;
        }
        else
        {
            termTarget[j] = false;
        }
    }
    
    global.energyHaulers = [];
    global.remoteHarvesters = [];
    global.numberOfHauler = [];
    global.arrayFlag = [];
    global.destRoom = [];

    numberOfHauler = [2,0,4,3,3,2,2,2,3,2];
    arrayFlag = [Game.flags.remote0, Game.flags.remote1, Game.flags.remote2, Game.flags.remote3, Game.flags.remote4, Game.flags.remote5, Game.flags.remote6, Game.flags.remote7, Game.flags.remote8, Game.flags.remote9];
    destRoom = [Game.rooms['W62N27'], Game.rooms['W62N29'], Game.rooms['W63N28'], Game.rooms['W62N27'], Game.rooms['W63N29'], Game.rooms['W63N27'], Game.rooms['W63N26'], Game.rooms['W66N31'], Game.rooms['W59N31'],Game.rooms['W59N31']];

    for (var k = 0, len = 10; k < len; k++)
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
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote7' && energyHaulersTotal[l].memory.home != destRoom[7])
        {
            energyHaulersTotal[l].memory.home = destRoom[7];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote8' && energyHaulersTotal[l].memory.home != destRoom[8])
        {
            energyHaulersTotal[l].memory.home = destRoom[8];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote9' && energyHaulersTotal[l].memory.home != destRoom[9])
        {
            energyHaulersTotal[l].memory.home = destRoom[9];
        }
    }

    
    global.claimers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer';});
    global.claimers2 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer2';});    
    global.claimers3 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer3';});
    global.claimers4 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer4';});
    global.claimers5 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer5';});
    global.claimers6 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer6';});
    global.claimers7 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer7';});
    global.claimers8 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer8';});
    global.claimers9 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer9';});
    attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker';});
    global.tempsers =  _.filter(Game.creeps, function(creep) { return creep.memory.role == 'temp';});
    
    
    for (var k = 0, len = controlledRooms.length; k < len; k++)
    {
        var currentRoom = controlledRooms[k];
        defendRoom(currentRoom.name);
        funcCreepSpawner(currentRoom,k,nbContainersInRoom,controlledRooms);
    }
    	//This part handle transfer between links
	var linkFrom = controlledRooms[2].lookForAt('structure', 34, 33)[0];
	var link2From = controlledRooms[2].lookForAt('structure', 30, 13)[0];
    var linkTo = controlledRooms[2].lookForAt('structure', 18, 12)[0]; 
    var linkFrom2 = controlledRooms[6].lookForAt('structure', 38, 8)[0];
    var link2From2 = controlledRooms[6].lookForAt('structure', 27, 18)[0];
    var linkTo2 = controlledRooms[6].lookForAt('structure', 31, 22)[0];
    var linkFrom3 =  controlledRooms[4].lookForAt('structure', 42, 40)[0];
    var link2From3 =  controlledRooms[4].lookForAt('structure', 14, 39)[0];
    var linkTo3 =  controlledRooms[4].lookForAt('structure', 30, 11)[0];
    var linkFrom4 = controlledRooms[3].lookForAt('structure', 23, 6)[0];
    var linkTo4 = controlledRooms[3].lookForAt('structure', 19, 14)[0]; 
    var linkFrom5 = controlledRooms[7].lookForAt('structure', 45, 3)[0];
    var link2From5 = controlledRooms[7].lookForAt('structure', 39, 28)[0];
    var linkTo5 = controlledRooms[7].lookForAt('structure', 20, 26)[0]; 
    var linkFrom6 = controlledRooms[8].lookForAt('structure', 13, 37)[0];
    var link2From6 = controlledRooms[8].lookForAt('structure', 34, 27)[0];
    var linkTo6 = controlledRooms[8].lookForAt('structure', 21, 35)[0]; 
    var linkFrom7 = controlledRooms[1].lookForAt('structure', 23, 13)[0];
    var link2From7 = controlledRooms[1].lookForAt('structure', 4, 10)[0];
    var linkTo7 = controlledRooms[1].lookForAt('structure', 40, 30)[0];

    
    
    
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
    if(link2From3 && linkTo3)
    {
        link2From3.transferEnergy(linkTo3);
    }
    if(linkFrom4 && linkTo4)
    {
        linkFrom4.transferEnergy(linkTo4);
    }
    if(linkFrom5 && linkTo5)
    {
        linkFrom5.transferEnergy(linkTo5);
    }
    if(link2From5 && linkTo5)
    {
        link2From5.transferEnergy(linkTo5);
    }
    if(linkFrom6 && linkTo6)
    {
        linkFrom6.transferEnergy(linkTo6);
    }
    if(link2From6 && linkTo6)
    {
        link2From6.transferEnergy(linkTo6);
    }
    if(linkFrom7 && linkTo7)
    {
        linkFrom7.transferEnergy(linkTo7);
    }
    if(link2From7 && linkTo7)
    {
        link2From7.transferEnergy(linkTo7);
    }

    //create reaction between Labs in Room 0
    var labs = controlledRooms[2].find(FIND_MY_STRUCTURES, 
        {filter: {structureType: STRUCTURE_LAB}});
    
    if(labs && labs.length > 2 && labs[1].cooldown == 0 && labs[0].mineralAmount > 0 && labs[2].mineralAmount > 0 && labs[1].mineralAmount < labs[1].mineralCapacity)
    {
        labs[1].runReaction(labs[0], labs[2]);
    }
    if(labs && labs.length > 4 && labs[5].cooldown == 0 && labs[2].mineralAmount > 0 && labs[3].mineralAmount > 0 && labs[5].mineralAmount < labs[5].mineralCapacity)
    {
        labs[5].runReaction(labs[2], labs[3]);
    }
    if(labs && labs.length > 5 && labs[4].cooldown == 0 && labs[1].mineralAmount > 0 && labs[5].mineralAmount > 0 && labs[4].mineralAmount < labs[4].mineralCapacity)
    {
        labs[4].runReaction(labs[1], labs[5]);
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
        else if(creep.memory.role == 'claimer7')
        {
            roleClaimer7(creep);
        }
        else if(creep.memory.role == 'claimer8')
        {
            roleClaimer8(creep);
        }
        else if(creep.memory.role == 'claimer9')
        {
            roleClaimer9(creep);
        }
        else if(creep.memory.role == 'temp')
        {
            creep.claimController(creep.room.controller);
            if(creep.pos.roomName != Game.flags.Flag10.pos.roomName)
            {
                creep.travelTo(Game.flags.Flag10);
            }
            /*else if (!creep.room.controller.my) {
                if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(creep.room.controller);
                }
                else
                {
                    creep.attackController(creep.room.controller);
                }
            }*/
            else
            {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(creep.room.controller);
                } 
            }
 
            creep.travelTo(Game.flags.Flag10);
            
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
    var nbContainersAtSource = [];
    for(var z = 0, leng = sources.length; z < leng; z++)
    {
        nbContainersAtSource[z] = sources[z].pos.findInRange(FIND_STRUCTURES, 2, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_CONTAINER;
            } 
        });
        //console.log(sources.length + " " +sources[z].room.name + " " + nbContainersAtSource[z].length)
    }

    var LinkActiveRoom =  activeRoom.find(FIND_STRUCTURES, {
        filter: function(object)
        {
            return object.structureType === STRUCTURE_LINK;
        } 
    });
    //console.log(activeRoom.name +'   ' + activeRoom.find(FIND_MINERALS)[0].mineralAmount);
    if(activeSpawns.length > 0)
    {
        for(var s = 0, len = activeSpawns.length; s < leng; s++)
        {
            if(activeRoom.controller.level < 8 && s > 0)
            {
               // console.log(activeRoom.name + " not level 8 exit spawn " + s );

            }
            else if (activeSpawns[s].spawning == null)
            {
                //console.log(activeRoom.name + " working on spawn " + activeSpawns[s] );
                if((!upgraders[index] || upgraders[index].length < 1) && ((harvesters[index].length < 2 && sources.length > 1) || (harvesters[index].length < 1 && sources.length == 1)) && activeRoom.controller.level < 8) 
                {   
                    if(activeSpawns[s].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], 'Harvester_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'harvester', home: activeRoom}});
                        console.log('Spawning new harvester ' + activeRoom.name );
                        harvesters[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == activeRoom.name;});                    
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], 'Harvester_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'harvester', home: activeRoom}});
                        console.log('Spawning new harvester ' + activeRoom.name );
                        harvesters[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == activeRoom.name;});                                        
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'Harvester_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'harvester', home: activeRoom}});
                        console.log('Spawning new harvester ' + activeRoom.name );
                        harvesters[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'harvester' && creep.memory.home.name == activeRoom.name;});                                        
                    }
                }
                else if((spawnhelpers[index].length < 2 || (index == 2 && spawnhelpers[index].length < 2)) && nbContainersInRoom[index].length > 0)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'SpawnHelp_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'spawnhelper', home: activeRoom}});
                        console.log('Spawning new spawnHelper ' + activeRoom.name );
                        spawnhelpers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'spawnhelper' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY], 'SpawnHelp_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'spawnhelper', home: activeRoom}});
                        console.log('Spawning new spawnHelper ' + activeRoom.name );
                        spawnhelpers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'spawnhelper' && creep.memory.home.name == activeRoom.name;});
                    }		
                }
                else if((miners2[index].length < 1 || (miners2[index].length < 2 && miners2[index][0].ticksToLive < 75 )) && nbContainersAtSource[0].length > 0)
                {      
                    if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {	
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'Miner2_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner2', home: activeRoom}});
                        console.log('Spawning new miner2 ' + activeRoom.name );
                        miners2[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner2' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'Miner2_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner2', home: activeRoom}});
                        console.log('Spawning new miner2 ' + activeRoom.name );
                        miners2[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner2' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'Miner2_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner2', home: activeRoom}});
                        console.log('Spawning new miner2 ' + activeRoom.name );
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,CARRY,MOVE], 'Miner2_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner2', home: activeRoom}});
                        console.log('Spawning new miner2 ' + activeRoom.name );
                    }
                }
                else if((miners[index].length < 1 || (miners[index].length <2 && miners[index][0].ticksToLive < 75)) && sources.length > 1 && nbContainersAtSource[1].length > 0)
                { 
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,CARRY,MOVE], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }   
                }
                else if(((energyMovers[index].length < 2 && miners2[index].length > 0 && miners[index].length > 0 && LinkActiveRoom && LinkActiveRoom.length < 3 ) || energyMovers[index].length < 1) &&(nbContainersInRoom[index].length > 1 || activeRoom.storage))
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerMover_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyMover', home: activeRoom}});
                        console.log('Spawning new energyMover ' + activeRoom.name );
                        energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                    }
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerMover_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyMover', home: activeRoom}});
                        console.log('Spawning new energyMover ' + activeRoom.name );
                        energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerMover_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyMover', home: activeRoom}});
                        console.log('Spawning new energyMover ' + activeRoom.name );
                        energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY], 'EnerMover_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyMover', home: activeRoom}});
                        console.log('Spawning new energyMover ' + activeRoom.name );
                        energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                    }	
                    else if(activeSpawns[s].spawnCreep([CARRY,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CARRY,CARRY,MOVE], 'EnerMover_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyMover', home: activeRoom}});
                        console.log('Spawning new energyMover ' + activeRoom.name );
                        energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                    }	
                }
                else if( activeRoom.name != 'W59N31' && ((!claimers || claimers.length < 1 ) || (claimers[0].ticksToLive < 100 && claimers.length < 2)) && Game.flags.remoteController && activeRoom.name != 'W63N29' && activeRoom.name != 'W62N29')
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer1_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer', home: activeRoom}});
                        console.log('Spawning new Claimer from ' + activeRoom.name );
                        claimers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer';});
                    }
                        
                }
                else if( activeRoom.name != 'W59N31' && ((!claimers2 || claimers2.length < 1 ) || (claimers2[0].ticksToLive < 100 && claimers2.length < 2)) && Game.flags.remoteController2)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer2_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer2', home: activeRoom}});
                        console.log('Spawning new Claimer2 from ' + activeRoom.name );
                        claimers2 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer2';});
                    }
                        
                }
                else if( activeRoom.name != 'W59N31' && ((!claimers3 || claimers3.length < 1 ) || (claimers3[0].ticksToLive < 100 && claimers3.length < 2)) && Game.flags.remoteController3 && activeRoom.name != 'W62N29')
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer3_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer3', home: activeRoom}});
                        console.log('Spawning new Claimer3 from ' + activeRoom.name );
                        claimers3 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer3';});
                    }                  
                }
                else if( activeRoom.name != 'W59N31' && ((!claimers5 || claimers5.length < 1 ) || (claimers5[0].ticksToLive < 100 && claimers5.length < 2)) && Game.flags.remoteController5)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer5_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer5', home: activeRoom}});
                        console.log('Spawning new Claimer5 from ' + activeRoom.name );
                        claimers5 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer5';});
                    }                  
                }
                else if( activeRoom.name != 'W59N31' && ((!claimers6 || claimers6.length < 1 ) || (claimers6[0].ticksToLive < 100 && claimers6.length < 2)) && Game.flags.remoteController6)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer6' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer6', home: activeRoom}});
                        console.log('Spawning new Claimer6 from ' + activeRoom.name );
                        claimers6 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer6';});
                    }                  
                }
                else if( activeRoom.name != 'W59N31' && ((!claimers4 || claimers4.length < 1 ) || (claimers4[0].ticksToLive < 100 && claimers4.length < 2)) && Game.flags.remoteController4)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer4_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer4', home: activeRoom}});
                        console.log('Spawning new Claimer4 from ' + activeRoom.name );
                        claimers4 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer4';});
                    }                  
                }
                else if(activeRoom.name != 'W59N31' && ((!claimers7 || claimers7.length < 1 ) || (claimers7[0].ticksToLive < 400 && claimers7.length < 2)) && Game.flags.remoteController7)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer7_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer7', home: activeRoom}});
                        console.log('Spawning new Claimer7 from ' + activeRoom.name );
                        claimers7 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer7';});
                    }                  
                }
                else if(((!claimers8 || claimers8.length < 1 ) || (claimers8[0].ticksToLive < 700 && claimers8.length < 2)) && Game.flags.remoteController8)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer8_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer8', home: activeRoom}});
                        console.log('Spawning new Claimer8 from ' + activeRoom.name );
                        claimers8 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer8';});
                    }                  
                }
                /*else if(((!claimers9 || claimers9.length < 0 ) || (claimers9[0].ticksToLive < 700 && claimers9.length < 0)) && Game.flags.remoteController9)
                {
                    if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CLAIM,CLAIM,CLAIM,MOVE,MOVE], 'Claimer9_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer9', home: activeRoom}});
                        console.log('Spawning new Claimer9 from ' + activeRoom.name );
                        claimers9 = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer9';});
                    }                  
                }*/
                else if(((((upgraders[index].length < 2 && sources.length > 1) ||(upgraders[index].length < 1 && sources.length == 1) || (upgraders[index].length < 2 && sources.length == 1 && activeRoom.storage) ) && activeRoom.controller.level < 8 )) && nbContainersInRoom[index].length > 0)
                //else if(upgraders[index].length < 1  && nbContainersInRoom[index].length > 0 & activeRoom.controller.level < 8) 
                {
                    //console.log(activeRoom.name + " " +activeRoom.controller.level);
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'Upgrader_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY], 'Upgrader_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader ' + activeRoom.name );
                    
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Upgrader_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,WORK,CARRY,CARRY], 'Upgrader_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'Upgrader_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if((upgraders[index].length < 1 || (upgraders[index][0].ticksToLive < 200 && upgraders[index].length < 2))  && nbContainersInRoom[index].length > 0 & activeRoom.controller.level == 8) 
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'Upgrader_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader (level 8) ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }  
                }
                else if(builders[index].length < 2 && constructsite[index] && constructsite[index].length > 0)
                {
                    
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: activeRoom}});
                        console.log('Spawning new builder ' + activeRoom.name );
                        builders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: activeRoom}});
                        console.log('Spawning new builder ' + activeRoom.name );
                        builders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,WORK,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: activeRoom}});
                        console.log('Spawning new builder ' + activeRoom.name );
                        builders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == activeRoom.name;});
                    }
                    
                }
                else if(nbRoadInRoom[index] && (roadrepairers[index].length < 2 && nbRoadInRoom[index].length > 75) || (roadrepairers[index].length < 1 && nbRoadInRoom[index].length < 76))  
                {
        
                    if(activeSpawns[s].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], 'RoadRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'roadrepair', Harvest: false, home: activeRoom}});
                        console.log('Spawning new roadRepairer ' + activeRoom.name );
                        roadrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name == activeRoom.name;}); 
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'RoadRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'roadrepair', Harvest: false, home: activeRoom}});
                        console.log('Spawning new roadRepairer ' + activeRoom.name );
                        roadrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name == activeRoom.name;}); 
                    }	
                }
                else if(roadrepairers[0].length < 0)
                {
        
                    if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'RoadRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'roadrepair', Harvest: false, home: Memory.myRooms[0]}});
                        console.log('Spawning new roadRepairer from: ' + activeRoom.name + ' for dest: ' + Memory.myRooms[0].name );
                        roadrepairers[0] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name ==  Memory.myRooms[0].name;});
                    }	
                }
                else if(attackers.length < 0)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], 'Attacker_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'attacker',home: activeRoom}});
                        console.log('Spawning new attacker: ' + activeRoom.name);
                        attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker'; });
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK], 'Attacker_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'attacker',home: activeRoom}});
                        console.log('Spawning new attacker: ' + activeRoom.name);
                        attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker';});
                    }
                }    
                else if(defensers[index].length < 1)
                {
                    if(activeSpawns[s].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE], 'Defenser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'defense', home: activeRoom}});
                        console.log('Spawning new defenser ' + activeRoom.name );
                        defensers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'defense' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([ATTACK,ATTACK,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([ATTACK,ATTACK,MOVE,MOVE], 'Defenser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'defense', home: activeRoom}});
                        console.log('Spawning new defenser ' + activeRoom.name );
                        defensers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'defense' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if(extractors[index].length < 1 && ExtractorInRoom && ExtractorInRoom.length > 0 && activeRoom.find(FIND_MINERALS)[0].mineralAmount > 0)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY], 'Extractor_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'extractor', home: activeRoom}});
                        console.log('Spawning new extractor ' + activeRoom.name );
                        extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY], undefined, { memory: {role: 'extractor', home: activeRoom}});
                        console.log('Spawning new extractor ' + activeRoom.name );
                        extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 'Extractor_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'extractor', home: activeRoom}});
                        console.log('Spawning new extractor ' + activeRoom.name );
                        extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'Extractor_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'extractor', home: activeRoom}});
                        console.log('Spawning new extractor ' + activeRoom.name );
                        extractors[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'extractor' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if ( (upcrossers[0].length < 0 && Memory.myRooms.length > 6) ||!upcrossers[0])
                {
                    if(activeSpawns[s].spawnCreep([[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[0]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[0].name +'  from ' + activeRoom)
                        upcrossers[0] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[0].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[0]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[0].name +'  from ' + activeRoom)
                        upcrossers[0] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[0].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[0]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[0].name +'  from ' + activeRoom )
                        upcrossers[0] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[0].name;});
                    }
                }
                else if ( (upcrossers[5].length < 0 && Memory.myRooms.length > 5) ||!upcrossers[5])
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[5]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[5].name +'  from ' + activeRoom)
                        upcrossers[5] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[5].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[5]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[5].name +'  from ' + activeRoom)
                        upcrossers[5] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[5].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[5]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[5].name +'  from ' + activeRoom)
                        upcrossers[5] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[5].name;});
                    }
                }
                else if(wallrepairers[index].length < 1)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    { 
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY], 'WallRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'wallrepair', home: activeRoom}});
                        console.log('Spawning new wallRepairer ' + activeRoom.name );
                        wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    { 
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,WORK,CARRY,CARRY], 'WallRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'wallrepair', home: activeRoom}});
                        console.log('Spawning new wallRepairer ' + activeRoom.name );
                        wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                    }
                    if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    { 
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'WallRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'wallrepair', home: activeRoom}});
                        console.log('Spawning new wallRepairer ' + activeRoom.name );
                        wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if(!builders[0] || (builders[0].length < 0 && constructsite[0] && constructsite[0].length > 0))
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: Memory.myRooms[0]}});
                        console.log('Spawning new builder for dest '+ Memory.myRooms[0].name + ' from '+ activeRoom.name);
                        builders[0]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[0].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: Memory.myRooms[0]}});
                        console.log('Spawning new builder for dest '+ Memory.myRooms[0].name + ' from '+ activeRoom.name);
                        builders[0]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[0].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY, MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY, MOVE], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: Memory.myRooms[0]}});
                        console.log('Spawning new builder for dest '+ Memory.myRooms[0].name + ' from '+ activeRoom.name);
                        builders[0]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[0].name;});
                    }	
                } 
                else if(upgraders[index].length < 4 && total > 50000 && activeRoom.controller.level < 8)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'UpgraderHi_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader (High storage) ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'UpgraderHi_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upgrader', home: activeRoom}});
                        console.log('Spawning new upgrader (High storage) ' + activeRoom.name );
                        upgraders[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upgrader' && creep.memory.home.name == activeRoom.name;});
                    }

                } 
            if(claimers.length > 0 && claimers2.length > 0 && claimers3.length > 0 && claimers4.length > 0  && claimers5.length > 0 && claimers6.length > 0 && claimers7.length > 0 && claimers8.length > 0 )//&& claimers9.length > 0)
            {
                    for (var r = 0, len = 9; r < len; r++)
                    {
                        //RemoteHarvesters & Haulers not required for now for that position
                        if(r == 1)
                        {
                            r++;
                        }
                    
                        if((arrayFlag[r].room && arrayFlag[r].room.controller && arrayFlag[r].room.controller.reservation && arrayFlag[r].room.controller.reservation.username == 'Pimaco' && arrayFlag[r].room.controller.reservation.ticksToEnd > 1700 ) || (arrayFlag[r].room && arrayFlag[r].room.controller.my))
                        {
                            if(remoteHarvesters[r] && (remoteHarvesters[r].length < 1 || (remoteHarvesters[r][0].ticksToLive < 270  && remoteHarvesters[r].length < 2)))
                            { 
                                if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                                {	
                                    activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY], 'RemHarv_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'remoteHarvester', home: activeRoom, currentFlag: arrayFlag[r] }});
                                    console.log('Spawning new RemoteHarvester' + r+' from ' + activeRoom.name );
                                    remoteHarvesters[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'remoteHarvester' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r);});
                                    break;
                                }
                            } 
                            else if(energyHaulers[r] && energyHaulers[r].length < numberOfHauler[r] )
                            {
                                //console.log(arrayFlag[r]);
                                //console.log(destRoom[r]);
                                if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                                {
                                    activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerHaul_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyHauler', home: Game.rooms[destRoom[r]], currentFlag: arrayFlag[r]}});
                                    console.log('Spawning new energyHauler'+ r + ' from ' + activeRoom.name );
                                    energyHaulers[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r) ;});
                                    break;
                                }
                                else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                                {
                                    activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerHaul_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyHauler', home: Game.rooms[destRoom[r]], currentFlag: arrayFlag[r]}});
                                    console.log('Spawning new energyHauler'+ r + ' from ' + activeRoom.name );
                                    energyHaulers[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r) ;});
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    

  var terminal = activeRoom.terminal;
 
    if(activeRoom.controller.level == 8 && terminal && !terminal.cooldown && (terminal.store[RESOURCE_ENERGY] > 20000) && total > 50000) 
    {
        for(var z = 0, leng = controlledRooms.length; z < leng; z++)
        {
            if(termTarget[z] == true && termTarget != activeRoom)
            {
                //console.log(terminal.send(RESOURCE_ENERGY, 10000, controlledRooms[z],'Transfer from LVL8 room'));
                console.log("Transfering energy from " + activeRoom.name + " to room " + controlledRooms[z].name );
                terminal.send(RESOURCE_ENERGY, 10000, controlledRooms[z].name,'Transfer from LVL8 room');  
            }
        }
       
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


