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
var roleScientist = require('role.scientist');

//var pathCalculator = require('pathCalculator');
var Traveler = require('Traveler');
"use strict";

//enable profiler module
profiler.enable();

module.exports.loop = function () {
    var Inventory = require('inventoryBuilder');
    //Gather some stats
    if (Memory.stats == undefined) {
        Memory.stats = {}
      }
      
      var rooms = Game.rooms
      
      var spawns = Game.spawns
      for (let roomKey in rooms) {
        let room = Game.rooms[roomKey]
        var isMyRoom = (room.controller ? room.controller.my : 0)
        if (isMyRoom) {
          Memory.stats['room.' + room.name + '.myRoom'] = 1
          Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable
          Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable
          Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress
          Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal
          var stored = 0
          var storedTotal = 0
      
          if (room.storage) {
            stored = room.storage.store[RESOURCE_ENERGY]
            storedTotal = room.storage.storeCapacity[RESOURCE_ENERGY]
          } else {
            stored = 0
            storedTotal = 0
          }
      
          Memory.stats['room.' + room.name + '.storedEnergy'] = stored
        }else {
          Memory.stats['room.' + room.name + '.myRoom'] = undefined
        }
      }
      Memory.stats['gcl.progress'] = Game.gcl.progress
      Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal
      Memory.stats['gcl.level'] = Game.gcl.level
      for (let spawnKey in spawns) {
        let spawn = Game.spawns[spawnKey]
        Memory.stats['spawn.' + spawn.name + '.defenderIndex'] = spawn.memory['defenderIndex']
      }
      
      Memory.stats['cpu.bucket'] = Game.cpu.bucket
      Memory.stats['cpu.limit'] = Game.cpu.limit
      //Memory.stats['cpu.stats'] = Game.cpu.getUsed() - lastTick
      Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()
    //var controlledRooms = Object.values(Game.rooms).filter(room => room.controller.my);
    global.controlledRooms =[];
    for(var name in Game.rooms) {
        if(Game.rooms[name].controller && Game.rooms[name].controller.my ==true){
            controlledRooms.push(Game.rooms[name]);
        }
    }
    //console.log(controlledRooms.length);
	if(Game.time % 100 || !Memory.myRooms || !Memory.myRooms.length < controlledRooms.length)
    {
        var rname = "";
        var dist = null;
        var myrooms = [];

        for (var i = 0, len = controlledRooms.length; i < len; i++)
        {
            Memory.myRooms[i] = controlledRooms[i];

            for ( var j=0, leng = controlledRooms.length; j < leng; j++)
            {
                rname = controlledRooms[j].name;
                rlevel = controlledRooms[j].controller.level;
                dist = Game.map.getRoomLinearDistance(controlledRooms[i].name,controlledRooms[j].name)
                if(!Memory.myRooms[i].DisOtherRoom )
                {
                    Memory.myRooms[i].DisOtherRoom = [];
                }
                if(!Memory.myRooms[i].DisOtherRoom[j])
                {    
                    Memory.myRooms[i].DisOtherRoom[j] = {};
                }

                Memory.myRooms[i].DisOtherRoom[j].rname = rname;
                Memory.myRooms[i].DisOtherRoom[j].rlevel = rlevel;
                Memory.myRooms[i].DisOtherRoom[j].dist = dist;
            }  

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
    global.ScienceEnabled = "W62N27";
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
    global.scientists = []; 
    
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
        scientists[j] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'scientist' && creep.memory.home.name == controlledRooms[j].name;});
        
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
        
        if(controlledRooms[j].storage && controlledRooms[j].terminal && controlledRooms[j].controller.level < 8 && controlledRooms[j].storage.store[RESOURCE_ENERGY] < 12000 && _.sum(controlledRooms[j].storage.store) < 250000 && controlledRooms[j].terminal.store[RESOURCE_ENERGY] < 9000 && _.sum(controlledRooms[j].terminal.store) < 290000)
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
    global.claimers = [];
    global.numberOfHauler = [];
    global.arrayFlag = [];
    global.destRoom = [];

    numberOfHauler = [1,1,1,1,1,1,1,1,1,1,1,1,1,1];

    arrayFlag = [Game.flags.remote0, Game.flags.remote1, Game.flags.remote2, Game.flags.remote3, Game.flags.remote4, Game.flags.remote5, Game.flags.remote6, Game.flags.remote7, Game.flags.remote8, Game.flags.remote9, Game.flags.remote10, Game.flags.remote11, Game.flags.remote12, Game.flags.remote13];
    destRoom = [Game.rooms['W62N27'], Game.rooms['W61N28'], Game.rooms['W63N28'], Game.rooms['W62N27'], Game.rooms['W63N29'], Game.rooms['W65N28'], Game.rooms['W63N26'], Game.rooms['W66N31'], Game.rooms['W59N31'],Game.rooms['W59N29'], Game.rooms['W62N27'], Game.rooms['W67N29'], Game.rooms['W67N27'], Game.rooms['W67N29']];
    arrayControllerFlag = [Game.flags.remoteController0, Game.flags.remoteController1, Game.flags.remoteController2, Game.flags.remoteController3, Game.flags.remoteController4, Game.flags.remoteController5, Game.flags.remoteController6, Game.flags.remoteController7, Game.flags.remoteController8, Game.flags.remoteController9, Game.flags.remoteController10, Game.flags.remoteController11, Game.flags.remoteController12, Game.flags.remoteController13];
    
    for (var k = 0, len = numberOfHauler.length; k < len; k++)
    {
        energyHaulers[k] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+k) ;});
        remoteHarvesters[k] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'remoteHarvester' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+k) ;});    
        claimers[k] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remoteController'+k) ;});            
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
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote10' && energyHaulersTotal[l].memory.home != destRoom[10])
        {
            energyHaulersTotal[l].memory.home = destRoom[10];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote11' && energyHaulersTotal[l].memory.home != destRoom[11])
        {
            energyHaulersTotal[l].memory.home = destRoom[11];
        }
        else if(energyHaulersTotal[l].memory.currentFlag.name == 'remote12' && energyHaulersTotal[l].memory.home != destRoom[12])
        {
            energyHaulersTotal[l].memory.home = destRoom[12];
        }
    }

    attackers = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'attacker';});
    global.tempsers =  _.filter(Game.creeps, function(creep) { return creep.memory.role == 'temp';});
    ScienceReation('W62N27');
    
    for (var k = 0, len = controlledRooms.length; k < len; k++)
    {
        var currentRoom = controlledRooms[k];
        defendRoom(currentRoom.name);
        funcCreepSpawner(currentRoom,k,nbContainersInRoom,controlledRooms);
    }
        //This part handle transfer between links
    var roomList = [Game.rooms['W59N29'], Game.rooms['W59N31'], Game.rooms['W61N28'], Game.rooms['W62N27'], Game.rooms['W63N26'], Game.rooms['W63N28'], Game.rooms['W63N29'], Game.rooms['W65N28'], Game.rooms['W66N31'], Game.rooms['W61N29'], Game.rooms['W67N27'], Game.rooms['W67N29']];    
 
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
        else if(creep.memory.role == 'scientist')
        {
            roleScientist.run(creep);
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
        else if(creep.memory.role == 'temp')
        {
            creep.claimController(creep.room.controller);
            if(creep.pos.roomName != Game.flags.ToReserve.pos.roomName)
            {
                creep.travelTo(Game.flags.ToReserve);
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
 
            creep.travelTo(Game.flags.ToReserve);
            
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
        var linksAtStorage = activeRoom.storage.pos.findInRange(FIND_STRUCTURES, 2, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_LINK;
            } 
        });
    }
    else
    {
        var total = 0;
        var linksAtStorage = [];
    }
    //console.log(activeRoom.name + "  " + total);
    var nbContainersAtSource = [];
    var nbContainerConstructSite = [];
    var linksAtSource = [];

    for(var z = 0, leng = sources.length; z < leng; z++)
    {
        nbContainersAtSource[z] = sources[z].pos.findInRange(FIND_STRUCTURES, 2, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_CONTAINER;
            } 
        });
        
        linksAtSource[z] = sources[z].pos.findInRange(FIND_STRUCTURES, 2, {
            filter: function(object)
            {
                return object.structureType === STRUCTURE_LINK;
            } 
        });
        
        if(linksAtSource[z] && linksAtSource[z].length == 1 && linksAtStorage && linksAtStorage.length == 1)
        {
            if(linksAtSource[z][0].cooldown == 0 && linksAtSource[z][0].energy > 0 && linksAtStorage[0].energy < linksAtStorage[0].energyCapacity)
            {
                linksAtSource[z][0].transferEnergy(linksAtStorage[0]);
            }
        }
        
        if(nbContainersAtSource[z].length == 0 && linksAtSource[z].length == 0)
        {
            nbContainerConstructSite[z] = sources[z].pos.findInRange(FIND_CONSTRUCTION_SITES, 2, {
                filter: function(object)
                {
                    return object.structureType === STRUCTURE_CONTAINER;
                } 
            }); 
        }

        if(activeRoom.controller.level > 4 && nbContainersAtSource[z].length < 1 && nbContainerConstructSite[z].length < 1)
        {
            terrain = Game.map.getRoomTerrain(activeRoom.name);
            //Let's build a new container at source

             // Find free positions around the source
            for (var y = sources[z].pos.y - 1; y <= sources[z].pos.y + 1; y++) {
                for (var x = sources[z].pos.x - 1; x <= sources[z].pos.x + 1; x++) {
                   //console.log(terrain.get(x, y));
                    if (terrain.get(x, y) !=  1 && nbContainerConstructSite[z] < 1) {
                        // lets see if it's reachable from the spawn
                        var pos = new RoomPosition(x, y, activeRoom.name)
                        var ret = PathFinder.search(activeRoom.controller.pos, pos, {
                            // I intend to build roads so I ignore swampsCost
                            swampCost: 1
                        });
                        activeRoom.createConstructionSite(x,y,STRUCTURE_CONTAINER);
                        nbContainerConstructSite[z] = 1;
                    }
                }
            }
        //console.log(sources.length + " " +sources[z].room.name + " " + nbContainersAtSource[z].length)
        }
    
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
        for(var s = 0, Slen = activeSpawns.length; s < Slen; s++)
        {
            if((activeRoom.controller.level < 8 || (activeRoom.controller.level == 8 && total < 25000 )) && s > 0 )
            {
               // console.log(activeRoom.name + " not level 8 exit spawn " + s );

            }
            else if (activeSpawns[s].spawning == null)
            {
                //console.log(activeRoom.name + " working on spawn " + activeSpawns[s] );
                if((!upgraders[index] || upgraders[index].length < 1) && ((harvesters[index].length < 2 && sources.length > 1) || (harvesters[index].length < 1 && sources.length == 1)) && activeRoom.controller.level < 9) 
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
                else if((spawnhelpers[index].length < 1 || (spawnhelpers[index][0].ticksToLive < 75 && spawnhelpers[index].length < 2)) && nbContainersInRoom[index].length > 0)
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
                else if((miners2[index].length < 1 || (miners2[index].length < 2 && miners2[index][0].ticksToLive < 75 )) && (nbContainersAtSource[0].length > 0 || linksAtSource[0].length > 0 || activeRoom.controller.level == 8))
                {      
                    if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {	
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], 'Miner2_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner2', home: activeRoom}});
                        console.log('Spawning new miner2 ' + activeRoom.name );
                        miners2[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner2' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if((miners[index].length < 1 || (miners[index].length <2 && miners[index][0].ticksToLive < 75)) && sources.length > 1 && (nbContainersAtSource[1].length > 0 || linksAtSource[1].length > 0 || activeRoom.controller.level == 8))
                { 
                    if(activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], 'Miner_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'miner', home: activeRoom}});
                        console.log('Spawning new miner ' + activeRoom.name );
                        miners[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'miner' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if(((energyMovers[index].length < 2 && miners2[index].length > 0 && miners[index].length > 0 && LinkActiveRoom && LinkActiveRoom.length < 3 ) || energyMovers[index].length < 1 || (energyMovers[index][0].ticksToLive < 150 && energyMovers[index].length < 2)) &&(nbContainersInRoom[index].length > 1 || activeRoom.storage))
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerMover_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyMover', home: activeRoom}});
                        console.log('Spawning new energyMover ' + activeRoom.name );
                        energyMovers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyMover' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
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
                else if(scientists[index] && activeRoom.name == ScienceEnabled && (scientists[index].length < 1 || (scientists[index][0] && scientists[index][0].ticksToLive < 150 && scientists[index].length < 2)) && activeRoom.storage && activeRoom.terminal)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'Scientist' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'scientist', home: activeRoom}});
                        console.log('Spawning new scientist ' + activeRoom.name );
                        scientists[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'scientist' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'Scientist' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'scientist', home: activeRoom}});
                        console.log('Spawning new scientist ' + activeRoom.name );
                        scientists[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'scientist' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'Scientist' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'scientist', home: activeRoom}});
                        console.log('Spawning new scientist ' + activeRoom.name );
                        scientists[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'scientist' && creep.memory.home.name == activeRoom.name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,CARRY,CARRY,CARRY,CARRY], 'Scientist' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'scientist', home: activeRoom}});
                        console.log('Spawning new scientist ' + activeRoom.name );
                        scientists[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'scientist' && creep.memory.home.name == activeRoom.name;});
                    }	
                    else if(activeSpawns[s].spawnCreep([CARRY,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([CARRY,CARRY,MOVE], 'Scientist' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'scientist', home: activeRoom}});
                        console.log('Spawning new scientist ' + activeRoom.name );
                        scientists[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'scientist' && creep.memory.home.name == activeRoom.name;});
                    }	
                }
                else if(claimers[0].length < 1  || claimers[1].length < 1 || claimers[2].length < 1 || claimers[3].length < 1 || claimers[4].length < 1  || claimers[5].length < 1 || claimers[6].length < 1 || claimers[7].length < 1 || claimers[8].length < 1 || claimers[9].length < 1 || claimers[10].length < 1  || claimers[11].length < 1 || claimers[12].length < 1 || claimers[13].length < 1)                
                {
                    var clmSpwDist = null;
                    for(var clm = 0, clmlen = 14; clm < clmlen; clm++)
                    {
                        clmSpwDist = Game.map.getRoomLinearDistance(activeSpawns[s].pos.roomName, arrayControllerFlag[clm].pos.roomName);
                        if(((!claimers[clm] || claimers[clm].length < 1 ) || (claimers[clm][0].ticksToLive < 100 && claimers[clm].length < 2)) && arrayControllerFlag[clm] && clmSpwDist < 2)
                        {
                            if(activeSpawns[s].spawnCreep([CLAIM,CLAIM,MOVE,MOVE],'testSpawn', { dryRun: true}) == OK)
                            {
                                activeSpawns[s].spawnCreep([CLAIM,CLAIM,MOVE,MOVE], 'Claimer' + clm +'_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'claimer', home: activeRoom, currentFlag: arrayControllerFlag[clm], currentFlagName: arrayControllerFlag[clm].name}});
                                console.log('Spawning new Claimer' + clm + ' from ' + activeRoom.name );
                                claimers[clm] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'claimer' && creep.memory.currentFlagName == arrayControllerFlag[clm].name ;});
                                break;
                            }
                        }   
                    }   
                }
                //else if(((((upgraders[index].length < 2 && sources.length > 1) ||(upgraders[index].length < 1 && sources.length == 1) || (upgraders[index].length < 2 && sources.length == 1 && activeRoom.storage) ) && activeRoom.controller.level < 8 )) && nbContainersInRoom[index].length > 0)
                else if(upgraders[index].length < 1  && nbContainersInRoom[index].length > 0 & activeRoom.controller.level < 8) 
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
                else if(nbRoadInRoom[index] && (roadrepairers[index].length < 2 && nbRoadInRoom[index].length > 100) || (roadrepairers[index].length < 1 && nbRoadInRoom[index].length < 101))  
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
                else if(roadrepairers[3].length < 0 )
                {
        
                    if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'RoadRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'roadrepair', Harvest: false, home: Memory.myRooms[3]}});
                        console.log('Spawning new roadRepairer from: ' + activeRoom.name + ' for dest: ' + Memory.myRooms[3].name );
                        roadrepairers[3] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'roadrepair' && creep.memory.home.name ==  Memory.myRooms[3].name;});
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
                }
                else if(extractors[index].length < 1 && ExtractorInRoom && ExtractorInRoom.length > 0 && activeRoom.find(FIND_MINERALS)[0].mineralAmount > 0 && activeRoom.terminal && ((_.sum(activeRoom.terminal.store) - activeRoom.terminal.store[RESOURCE_ENERGY]) < 150000) && _.sum(activeRoom.terminal.store) < 275000)
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
                }
                else if (index < 10 && (upcrossers[0].length < 5) ||!upcrossers[0])
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
                else if (index < 10 && (upcrossers[1].length < 5) ||!upcrossers[1])
                {
                    if(activeSpawns[s].spawnCreep([[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[3]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[1].name +'  from ' + activeRoom)
                        upcrossers[1] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[1].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[1]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[1].name +'  from ' + activeRoom)
                        upcrossers[1] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[1].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'Upcrosser_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'upcrosser', home: Memory.myRooms[1]}});
                        console.log('Spawning new upcrosser for dest  '+ Memory.myRooms[1].name +'  from ' + activeRoom )
                        upcrossers[1] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'upcrosser' && creep.memory.home.name == Memory.myRooms[1].name;});
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
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY,MOVE],'testSpawn', { dryRun: true}) == OK)
                    { 
                        activeSpawns[s].spawnCreep([WORK,CARRY,MOVE], 'WallRep_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'wallrepair', home: activeRoom}});
                        console.log('Spawning new wallRepairer ' + activeRoom.name );
                        wallrepairers[index] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'wallrepair' && creep.memory.home.name == activeRoom.name;});
                    }
                }
                else if(!builders[0] || (builders[0].length < 0 && constructsite[0] && constructsite[0].length > 0) && index > 1)
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
                else if(!builders[1] || (builders[1].length < 0 && constructsite[1] && constructsite[1].length > 0) && index > 1)
                {
                    if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: Memory.myRooms[1]}});
                        console.log('Spawning new builder for dest '+ Memory.myRooms[1].name + ' from '+ activeRoom.name);
                        builders[1]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[1].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([MOVE,MOVE,WORK,WORK,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: Memory.myRooms[1]}});
                        console.log('Spawning new builder for dest '+ Memory.myRooms[1].name + ' from '+ activeRoom.name);
                        builders[1]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[1].name;});
                    }
                    else if(activeSpawns[s].spawnCreep([WORK,CARRY, MOVE],'testSpawn', { dryRun: true}) == OK)
                    {
                        activeSpawns[s].spawnCreep([WORK,CARRY, MOVE], 'Builder_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'builder', home: Memory.myRooms[1]}});
                        console.log('Spawning new builder for dest '+ Memory.myRooms[1].name + ' from '+ activeRoom.name);
                        builders[1]= _.filter(Game.creeps, function(creep) { return creep.memory.role == 'builder' && creep.memory.home.name == Memory.myRooms[1].name;});
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
            if(claimers[0].length > 0  && claimers[1].length > 0 && claimers[2].length > 0 && claimers[3].length > 0 && claimers[4].length > 0  && claimers[5].length > 0 && claimers[6].length > 0 && claimers[7].length > 0 && claimers[8].length > 0 && claimers[9].length > 0 && claimers[11].length > 0 && claimers[12].length > 0)
            {
            var roomDist = null;
                for (var r = 0, len = 14; r < len; r++)
                {
                    //RemoteHarvesters & Haulers not required for now for that position
                    if(r == 120)
                    {
                        r++;
                    }
                
                    if((arrayFlag[r].room && arrayFlag[r].room.controller && arrayFlag[r].room.controller.reservation && arrayFlag[r].room.controller.reservation.username == 'Pimaco' && arrayFlag[r].room.controller.reservation.ticksToEnd > 1700 ) || (arrayFlag[r].room && arrayFlag[r].room.controller.my))
                    {

                        roomDist = Game.map.getRoomLinearDistance(activeSpawns[s].pos.roomName, arrayFlag[r].pos.roomName);
                        if(remoteHarvesters[r] && (remoteHarvesters[r].length < 1 || (remoteHarvesters[r][0].ticksToLive < 270  && remoteHarvesters[r].length < 2)) && roomDist < 3)
                        { 
                            if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY],'testSpawn', { dryRun: true}) == OK)
                            {	
                                activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY], 'RemHarv' + r + '_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'remoteHarvester', home: activeRoom, currentFlag: arrayFlag[r] }});
                                console.log('Spawning new RemoteHarvester' + r+' from ' + activeRoom.name );
                                remoteHarvesters[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'remoteHarvester' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r);});
                                break;
                            }
                        } 
                        else if(energyHaulers[r] && energyHaulers[r].length < numberOfHauler[r] && roomDist < 3)
                        {
                            //console.log(arrayFlag[r]);
                            //console.log(destRoom[r]);
                            if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                            {
                                activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerHaul' + r + '_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyHauler', home: Game.rooms[destRoom[r]], currentFlag: arrayFlag[r]}});
                                console.log('Spawning new energyHauler'+ r + ' from ' + activeRoom.name );
                                energyHaulers[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r) ;});
                                break;
                            }
                            /* else if(activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],'testSpawn', { dryRun: true}) == OK)
                            {
                                activeSpawns[s].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], 'EnerHaul_' + activeRoom.name + '_' + (Math.floor(Math.random() * 100) + 1), { memory: {role: 'energyHauler', home: Game.rooms[destRoom[r]], currentFlag: arrayFlag[r]}});
                                console.log('Spawning new energyHauler'+ r + ' from ' + activeRoom.name );
                                energyHaulers[r] = _.filter(Game.creeps, function(creep) { return creep.memory.role == 'energyHauler' && creep.memory.currentFlag && creep.memory.currentFlag.name == ('remote'+r) ;});
                                break;
                            }*/
                        }
                    }
                }
            }
        }
    }
}
    

  var terminal = activeRoom.terminal;
    /*if(terminal)
    {
        console.log(terminal.pos.roomName + "  " + terminal + "    " + terminal.store[RESOURCE_ENERGY]);
    }*/
    if(activeRoom.controller.level == 8 && terminal && !terminal.cooldown && (terminal.store[RESOURCE_ENERGY] > 20000)) 
    {
        for(var z = 0, leng = controlledRooms.length; z < leng; z++)
        {
            if(termTarget[z] == true && termTarget != activeRoom)
            {
                //console.log(terminal.send(RESOURCE_ENERGY, 10000, controlledRooms[z],'Transfer from LVL8 room'));
                console.log("Transfering energy from " + activeRoom.name + " to room " + controlledRooms[z].name );
                terminal.send(RESOURCE_ENERGY, 10000, controlledRooms[z].name,'Transfer from LVL8 room');  
                break;
            }
        } 
    }

    if(terminal && !terminal.cooldown && activeRoom.name == ScienceEnabled && terminal.store[RESOURCE_UTRIUM] > 3000)
    {
        var amount = terminal.store[RESOURCE_UTRIUM] - 3000;
        terminal.send(RESOURCE_UTRIUM, amount, 'W67N27');
    }

    if(terminal && !terminal.cooldown && terminal.store && activeRoom.name != ScienceEnabled &&  ScienceEnabled != 'NotEnabled' && (_.sum(terminal.store) - terminal.store[RESOURCE_ENERGY]) >= 100 &&  terminal.store[RESOURCE_ENERGY] > 100)
    {
        
        var neededRsc = [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_HYDROGEN];
       
        for(var z = 0, len = neededRsc.length; z < len; z++)
        {
            if(!terminal.cooldown && terminal.store[RESOURCE_ENERGY] && terminal.store[RESOURCE_ENERGY] >= 800 && terminal.store[neededRsc[z]] && terminal.store[neededRsc[z]] >= 800 && (Game.rooms[ScienceEnabled].terminal.store[neededRsc[z]] < 3000 || !Game.rooms[ScienceEnabled].terminal.store[neededRsc[z]]))
            {
                console.log("Transfering " + neededRsc[z] +" from " + activeRoom.name + " to room " + Game.rooms[ScienceEnabled] );
                terminal.send(neededRsc[z], terminal.store[neededRsc[z]], Game.rooms[ScienceEnabled].name, 'Transfer resources for Lab');
            }
            else if(Game.market.credits > 900000 && !Game.rooms[ScienceEnabled].terminal.cooldown && !Game.rooms[ScienceEnabled].terminal.store[neededRsc[z]] || Game.rooms[ScienceEnabled].terminal.store[neededRsc[z]] < 800 && Game.rooms[ScienceEnabled].terminal.store[RESOURCE_ENERGY] > 500)
            {
                var orders = Game.market.getAllOrders(order => order.resourceType == neededRsc[z] && order.type == ORDER_SELL && order.price < 0.15 && Game.market.calcTransactionCost(800, 'W62N27', order.roomName) < Game.rooms[ScienceEnabled].terminal.store[RESOURCE_ENERGY]);
                console.log("Buying resource " + neededRsc[z] + " from order " + orders[0].id + " at price " + orders[0].price);
                Game.market.deal(orders[0].id,800,Game.rooms[ScienceEnabled].name);
            }
        }
    }
    else if( terminal && !terminal.cooldown && terminal.store && activeRoom.name == ScienceEnabled && terminal.store[RESOURCE_ENERGY] >= 500 &&  terminal.store[RESOURCE_GHODIUM_HYDRIDE] > 500)
    {
        if(Game.rooms['W63N28'].terminal && Game.rooms['W63N28'].terminal.store[RESOURCE_GHODIUM_HYDRIDE] <= 1500 )
        {
            console.log("Send GH to W63N28");
            terminal.send(RESOURCE_GHODIUM_HYDRIDE, terminal.store[RESOURCE_GHODIUM_HYDRIDE], 'W63N28');
        }
        else if(Game.rooms['W65N28'].terminal && Game.rooms['W65N28'].terminal.store[RESOURCE_GHODIUM_HYDRIDE] <= 1500 )
        {
            console.log("Send GH to W65N28");
            terminal.send(RESOURCE_GHODIUM_HYDRIDE, terminal.store[RESOURCE_GHODIUM_HYDRIDE], 'W65N28');
        }
    }

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
			if(username != 'Invader' && (username != 'dragoonreas'))
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

function ScienceReation(roomName)
{
    //create reaction between scienceLabs in provided room.
   // var scienceLabs = Game.rooms[roomName].find(FIND_MY_STRUCTURES, 
   //     {filter: {structureType: STRUCTURE_LAB}});
    global.scienceLabs = [Game.rooms[roomName].lookForAt('structure', 19, 9)[0], Game.rooms[roomName].lookForAt('structure', 21, 9)[0], Game.rooms[roomName].lookForAt('structure', 23, 9)[0], Game.rooms[roomName].lookForAt('structure', 25, 9)[0], Game.rooms[roomName].lookForAt('structure', 20, 8)[0], Game.rooms[roomName].lookForAt('structure', 22, 8)[0], Game.rooms[roomName].lookForAt('structure', 24, 8)[0], Game.rooms[roomName].lookForAt('structure', 21, 7)[0], Game.rooms[roomName].lookForAt('structure', 23, 7)[0], Game.rooms[roomName].lookForAt('structure', 22, 6)[0]] ; 
    //This will produce GH if structure is as follow
    /*
                9-GH
            7-G     8-H
        4-ZK    5-UL*    6-UL       (UL in 6 to be transferrd to 5 by scientist)
    0-Z     1-K     2-U     3-L
    */
    if(scienceLabs && scienceLabs.length > 2 && scienceLabs[4].cooldown == 0 && scienceLabs[0].mineralAmount > 0 && scienceLabs[1].mineralAmount > 0 && scienceLabs[4].mineralAmount < scienceLabs[4].mineralCapacity)
    {
        scienceLabs[4].runReaction(scienceLabs[0], scienceLabs[1]);
    }
    if(scienceLabs && scienceLabs.length > 6 && scienceLabs[6].cooldown == 0 && scienceLabs[2].mineralAmount > 0 && scienceLabs[3].mineralAmount > 0 && scienceLabs[6].mineralAmount < scienceLabs[6].mineralCapacity)
    {
        scienceLabs[6].runReaction(scienceLabs[2], scienceLabs[3]);
    }
    if(scienceLabs && scienceLabs.length > 5 && scienceLabs[4].cooldown == 0 && scienceLabs[1].mineralAmount > 0 && scienceLabs[5].mineralAmount > 0 && scienceLabs[4].mineralAmount < scienceLabs[4].mineralCapacity)
    {
        scienceLabs[4].runReaction(scienceLabs[1], scienceLabs[5]);
    }
    if(scienceLabs && scienceLabs.length > 7 && scienceLabs[7].cooldown == 0 && scienceLabs[4].mineralAmount > 0 && scienceLabs[5].mineralAmount > 0 && scienceLabs[7].mineralAmount < scienceLabs[7].mineralCapacity)
    {
        scienceLabs[7].runReaction(scienceLabs[4], scienceLabs[5]);
    }
    if(scienceLabs && scienceLabs.length > 9 && scienceLabs[9].cooldown == 0 && scienceLabs[7].mineralAmount > 0 && scienceLabs[8].mineralAmount > 0 && scienceLabs[9].mineralAmount < scienceLabs[9].mineralCapacity)
    {
        scienceLabs[9].runReaction(scienceLabs[7], scienceLabs[8]);
    }
    /*if(scienceLabs[9].mineralType == RESOURCE_GHODIUM_HYDRIDE && scienceLabs[9].mineralAmount >= 30 && scienceLabs[9].energy >= 20)
    {
        var screepsAtLab = scienceLabs[9].pos.findInRange(FIND_CREEPS, 1, {
            filter: function(object)
            {
                return object.memory.role === 'upgrader';
            } 
        });
        if(screepsAtLab && screepsAtLab.length > 0)
        {
            scienceLabs[9].boostCreep(screepsAtLab[0]);
        }
    }*/
}

