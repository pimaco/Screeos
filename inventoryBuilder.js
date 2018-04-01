var Inventory = /** @class */ (function () {
    function Inventory() {
    }
    var CreepControllers = ['attacker','harvester','defense','upgrader2','upgraderroom2','upgrader','builder','builder2','roadrepair','roadrepair2','wallrepair','spawnhelper','miner','miner2','linker','upcrosser','energyMover'];
    Inventory.update = function () {
       // var invDiag = debug.diag('Inventory');
        Inventory.invFlags();
        Inventory.invCreeps();
        for (var r in Game.rooms) {
            var room = Game.rooms[r];
            // room.memory['energy'] = room.memory['energyCapacity'] = 0;
            if (!room.memory.source)
                Inventory.invRoomSources(room);
            if (!room.memory.mineral)
                Inventory.invRoomMinerals(room);
            var hostile_creeps = room.find(FIND_HOSTILE_CREEPS);
            // console.log(hostile_creeps);
            room.memory.under_attack = hostile_creeps.length;
            if (hostile_creeps.length > 0)
                room.memory.last_attack = Game.time;
            var construction_sites = room.find(FIND_MY_CONSTRUCTION_SITES);
            var construction_finished = false;
            if (construction_sites.length < room.memory.constructing) {
                console.log('Some construction finished in room ', room.name);
                construction_finished = true;
            }
            room.memory.constructing = construction_sites.length;
            //Only update structure counts if need be.
            if (!room.memory.last_attack)
                room.memory.last_attack = Game.time;
            var attack_finished = room.memory.last_attack > room.memory.last_updated;// && Game.time - room.memory.last_attack > Globals.ALL_CLEAR_AFTER;
            var reload = Memory['reload'] || !room.memory.last_updated || attack_finished || construction_finished;
            // console.log(room.memory.last_attack > room.memory.last_updated, Game.time - room.memory.last_attack, room);
            if (reload && room.name != 'W63N26' && room.name != 'W62N26' && room.name != 'W64N27' && room.name != 'W63N26' && room.name != 'W64N30' && room.name != 'W64N29')  {
                console.log('Refreshing structure counts for room', room.name);
                Inventory.invRoomStructures(room);
               // Inventory.invHighestCreepTiers(room);
                room.memory.last_updated = Game.time;
            }
            // Inventory.invHighestCreepTiers(room);
            // Inventory.generateMaxCreepCount(room);
            // Inventory.updateSpawnQueue(room);
            //Do this only once per room, not once per spawn:
            // SpawnController.generateMaxCreepCount(room);
            //SpawnController.generateQueue(room);
            //Note: this should be run after generateMaxCreepCount
            Inventory.updateObsoleteCreeps(room);
            if (room.memory['structures']['storage'] && room.memory['structures']['storage'].length && room.name != 'W63N26') {
                var storage = Game.getObjectById(room.memory['structures']['storage'][0]);
                
                room.memory.storage = storage.store;
                if (!room.memory.storage.energy)
                    room.memory.storage.energy = 0; //make sure it gets set
            }
            else {
                //we get "Cannot assign to read only property 'energy' of 0" if you try to set the value directly
                room.memory.storage = { energy: 0 };
            }
        }
        Memory['reload'] = false; //Reset the reload flag. This can be manually flipped to reload caches.
       // invDiag.stop();
    };
    Inventory.invRoomSources = function (room) {
        var sources = room.find(FIND_SOURCES);
        if (!room.memory['source'])
            room.memory['source'] = {};
        for (var s in sources) {
            var source = sources[s];
            if (!room.memory['source'][source.id])
                room.memory['source'][source.id] = {};
        }
    };
    Inventory.room_sources = function (room) {
        if (room.memory['source'])
            return Object.keys(room.memory['source']).length;
        else
            return 0;
    };
    Inventory.invRoomMinerals = function (room) {
        var minerals = room.find(FIND_MINERALS);
        if (!room.memory['mineral'])
            room.memory['mineral'] = {};
        for (var s in minerals) {
            var mineral = minerals[s];
            if (!room.memory['mineral'][mineral.id])
                room.memory['mineral'][mineral.id] = {};
        }
    };
    Inventory.room_minerals = function (room) {
        if (room.memory['mineral'])
            return Object.keys(room.memory['mineral']).length;
        else
            return 0;
    };
    Inventory.invRoomStructures = function (room) {
        var structures = room.find(FIND_STRUCTURES);
        // room.memory.structures = {};
        var by_type = {};
        for (var s in structures) {
            var structure = structures[s];
            if (!by_type[structure.structureType])
                by_type[structure.structureType] = [];
            by_type[structure.structureType].push(structure.id);
            // if (!by_type[structure.structureType][structure.id]) by_type[structure.structureType][structure.id] = {};
            // console.log(structure.structureType);
            // if (structure.structureType == 'spawn' || structure.structureType == 'extension') {
            //     room.memory['energy'] += (<Spawn>structure).energy;
            //     room.memory['energyCapacity'] += (<Spawn>structure).energyCapacity;
            // }
        }
        room.memory.structures = by_type;
    };
    Inventory.room_structure_count = function (type, room) {
        if (room.memory['structures'] && room.memory['structures'][type])
            return room.memory['structures'][type].length;
        else
            return 0;
    };
    Inventory.invFlags = function () {
        //garbage collect flags
        for (var f in Memory.flags) {
            if (!Game.flags[f]) {
                if (Memory.flags[f].room_name)
                    delete Memory.rooms[Memory.flags[f].room_name]['flags'][f];
                delete Memory.flags[f];
            }
            else if (Memory.flags[f].creeps) {
                for (var c in Memory.flags[f].creeps) {
                    if (!Game.creeps[Memory.flags[f].creeps[c]]) {
                        // delete Memory.flags[f].creeps[c]
                        Memory.flags[f].creeps.splice(c, 1);
                    }
                }
            }
        }
        for (var f in Game.flags) {
            var flag = Game.flags[f], split_loc = flag.name.indexOf('_');
            if (!flag.memory.flag_type && split_loc != -1) {
                var room_name = flag.name.substr(0, split_loc), flag_id = flag.name.substr(split_loc + 1), flag_type = flag_id, flag_num = 0;
                var id_split_loc = flag_id.indexOf('-');
                if (id_split_loc != -1) {
                    flag_type = flag_id.substr(0, id_split_loc);
                    flag_num = parseInt(flag_id.substr(id_split_loc + 1));
                }
                flag.memory.room_name = room_name;
                flag.memory.flag_type = flag_type;
                flag.memory.flag_num = flag_num;
            }
            if (flag.memory.room_name) {
                if (!Memory.rooms[flag.memory.room_name])
                    Memory.rooms[flag.memory.room_name] = {};
                if (!Memory.rooms[flag.memory.room_name]['flags'])
                    Memory.rooms[flag.memory.room_name]['flags'] = {};
                Memory.rooms[flag.memory.room_name]['flags'][flag.name] = {};
            }
            // debug.log();
            // console.log(flag);
            // let attack_flag = Game.flags[`${this.structure.room.name}_attack`];
            // if (attack_flag) {
            //     values.guard += 2;
            //     values.healer += 2;
            //     values.ranger += 2;
            // }
        }
    };
    Inventory.invCreeps = function () {
        //Reset room creep counts:
        for (var r in Game.rooms) {
            var room = Game.rooms[r];
            // delete room.memory['creep_roles']; //needs to be rebuilt.
            room.memory['creeps'] = {}; //needs to be rebuilt.
        }
        //Clear out the old memory:
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                console.log('Deleting ' + Memory.creeps[name].role + " creep " + name + " from memory.");
                delete Memory['creeps'][name];
            }
        }
        
        for (var c in Game.creeps) {
            var creep = Game.creeps[c];
            Inventory.invCreepObj(creep);
        }
    };
    Inventory.room_creep_count = function (role, room, target) {
        target = target || 'home';
        if (room.memory['creeps'] && room.memory['creeps'][target] && room.memory['creeps'][target][role])
            return room.memory['creeps'][target][role].length;
        else
            return 0;
    };
    //Shouldn't really be necessary anymore:
    Inventory.calculateCreepCost = function (creep) {
        console.log(creep);
        // return _.reduce(_.map(creep.body, (obj) => { return obj.type; }), (a, b) => { return a + BODYPART_COST[b] }, 0);
    };
   /* Inventory.invHighestCreepTiers = function (room) {
        if (!room.memory['highest_creep_teir'])
            room.memory['highest_creep_teir'] = {};
        // let budget = room.energyAvailable;
        for (var role in CreepControllers) {
            var ctrl = CreepControllers[role];
            room.memory['highest_creep_teir'][role] = ctrl.get_heighest_tier(room);
            // for (let t in ctrl.creep_tiers) {
            //     let tier = ctrl.creep_tiers[t];
            //     if (tier.cost <= budget) {
            //         room.memory['highest_creep_teir'][role] = tier;
            //         break;
            //     }
            // }
        }
    };
    Inventory.getHighestCreepTier = function (room, role) {
        return room.memory['highest_creep_teir'][role];
    };*/
    //Note: this should be run after generateMaxCreepCount
    //This doesn't work too good because it's not accounting for the creeps already marked as obsolete...
    Inventory.updateObsoleteCreeps = function (room) {
        // for (let role in room.memory.creep_roles){
        //     let max_count = room.memory.max_creeps[role];
        //     //Note: this is only the non-obsolete creeps:
        //     let creeps = room.memory.creep_roles[role], count = creeps.length;
        //     // if (count > max_count) {
        //     // let non_obsolete = [];
        //     // _.forEach(room.memory.creep_roles[role], (name) => {
        //     //     // console.log(!Memory.creeps[name].obsolete);
        //     //     let creep = Game.creeps[name];
        //     //     if (!creep.memory.obsolete && creep.memory.office == creep.memory.home) { //not a foreign creep
        //     //         non_obsolete.push({
        //     //             name: name,
        //     //             time: creep.ticksToLive
        //     //         });
        //     //     }
        //     // });
        //     if (count > max_count) {
        //         let sorted = _.sortBy(creeps, (obj) => { 
        //             return obj.time; 
        //         });
        //         // console.log(`Too many ${role}s in ${room.name}, delete ${sorted.length - max_count}`);
        //         for (let i = 0; i < sorted.length - max_count; i++) {
        //             let name = sorted[i];
        //             // console.log(name);
        //             Memory.creeps[name].obsolete = true;
        //             console.log(`Making ${role} ${name} obsolete in room ${room.name}`);
        //         }
        //     }
        // }
    };
    Inventory.invCreepObj = function (creep) {
        // console.log(creep);
        var role = creep.memory.role, name = creep.name, home = creep.memory.home;
        if (!creep.memory.home) home = creep.memory.home = creep.room.name;
        // if (!creep.memory.office) creep.memory.office = creep.room.name;
        var room = Game.rooms[home.name];
        var target = creep.memory.flag ? creep.memory.flag : 'home';
        
        this.invCreep(room, target, role, name);
         //console.log('creeps', target, role, name);
        if (!creep.memory.obsolete && creep.memory.home == creep.room.name) {
         //   var tier = Inventory.getHighestCreepTier(room, role);
         //   if (creep.memory.cost < tier.cost) {
         //       creep.memory.obsolete = true;
         //       console.log("Detected obsolete " + creep.memory.role + " creep named " + name + " in room " + room.name);
         //   }
            // let ctrl = CreepControllers[role];
            // if (ctrl) {
            //     if (ctrl.creep_is_obsolete(creep, room) === true) {
            //         creep.memory.obsolete = true;
            //         console.log(`Detected obsolete ${creep.memory.role} creep named ${name} in room ${room.name}`);
            //     }
            // } else {
            //     console.log(`Inventory unable to find creep controller for ${creep}`);
            // }
        }
    };
    Inventory.invCreep = function (room, target, role, name) {
       // console.log(room);
        if (!room.memory.creeps)
        {
            room.memory.creeps = {};
        }
        if (!room.memory.creeps.target)
        {
            room.memory.creeps.target = {};
        }
        if (!room.memory.creeps.target.role)
        {
            room.memory.creeps.target.role = [];
            //room.memory.room.target.role.push(name);
        }     
        room.memory.creeps.target.role.push(name);
    };
    Inventory.invNewCreep = function (role, name, room) {
        // currently used by (role == "ranger" || role == "guard" || role == "runner") :
        var flag_name = room.name + "_" + role;
        var target = 'home';
        if (Game.flags[flag_name]) {
            if (!Game.flags[flag_name].memory.creeps)
                Game.flags[flag_name].memory.creeps = [];
            Game.flags[flag_name].memory.creeps.push(name);
            target = flag_name;
        }
        this.invCreep(room, target, role, name);
    };
    return Inventory;
}());
module.exports = Inventory;