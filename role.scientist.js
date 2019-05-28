var roleScientist = {
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {   
        /*var labs =   creep.room.find(FIND_STRUCTURES,{filter: function(object) 
            {
                return object.structureType === STRUCTURE_LAB
            }});  
        */
        var labs = [Game.rooms[creep.pos.roomName].lookForAt('structure', 19, 9)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 21, 9)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 23, 9)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 25, 9)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 20, 8)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 22, 8)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 24, 8)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 21, 7)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 23, 7)[0], Game.rooms[creep.pos.roomName].lookForAt('structure', 22, 6)[0]] ; 
  
        
        if(!creep.memory.containerSource)
        {
            creep.memory.containerSource = null
        }
        if(!creep.memory.containerTarget)
        {
            creep.memory.containerTarget = null
        }

        if(creep.memory.varresource == null || creep.memory.varresource == undefined)
        {
            creep.memory.varresource = RESOURCE_ENERGY;
        }

        if(labs && labs.length > 0 && creep.room.terminal)
        {
            
            
            for (var i = 0, len = labs.length; i < len; i++)
            {        
                if(labs[i].energy < 2000)
                {
                    //console.log(creep.name + "  "+ labs[i]);
                    creep.memory.containerSource = creep.room.storage;
                    creep.memory.containerTarget = labs[i];
                    break;
                }
            }

            if(creep.carry.energy > 0 && (creep.memory.containerTarget == null || creep.memory.containerTarget == creep.room.storage))
            {
                 creep.memory.containerTarget = creep.room.storage;
            }
            else if (!creep.carry.energy || creep.carry.energy == 0)
            {
                if(labs[0] && (labs[0].mineralType == RESOURCE_ZYNTHIUM || labs[0].mineralType == undefined) && labs[0].mineralAmount < (labs[0].mineralCapacity - creep.carryCapacity) && creep.room.terminal.store[RESOURCE_ZYNTHIUM] > 0)
                {
                    creep.memory.varresource = RESOURCE_ZYNTHIUM;
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = labs[0];
                }
                else if(labs[1] && (labs[1].mineralType == RESOURCE_KEANIUM || labs[1].mineralType == undefined) && labs[1].mineralAmount < (labs[1].mineralCapacity - creep.carryCapacity) && creep.room.terminal.store[RESOURCE_KEANIUM] > 0)
                {
                    creep.memory.varresource = RESOURCE_KEANIUM;
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = labs[1];
                }
                else if(labs[2] && (labs[2].mineralType == RESOURCE_UTRIUM || labs[2].mineralType == undefined) && labs[2].mineralAmount <  (labs[2].mineralCapacity - creep.carryCapacity) && creep.room.terminal.store[RESOURCE_UTRIUM] > 0)
                {
                    creep.memory.varresource = RESOURCE_UTRIUM;
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = labs[2];
                }
                else if(labs[3] && (labs[3].mineralType == RESOURCE_LEMERGIUM || labs[3].mineralType == undefined) && labs[3].mineralAmount < (labs[3].mineralCapacity - creep.carryCapacity) && creep.room.terminal.store[RESOURCE_LEMERGIUM] > 0)
                {
                    creep.memory.varresource = RESOURCE_LEMERGIUM;
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = labs[3];
                }
                else if(labs[6] && labs[5] && (labs[6].mineralType == RESOURCE_UTRIUM_LEMERGITE) && labs[6].mineralAmount >= 800 && labs[5].mineralCapacity - labs[5].mineralAmount >= 800)
                {
                    creep.memory.varresource = RESOURCE_UTRIUM_LEMERGITE;
                    creep.memory.containerSource = labs[6];
                    console.log(_.findKey(creep.carry));
                    if((creep.carry && creep.carry[RESOURCE_UTRIUM_LEMERGITE] && !creep.carry[RESOURCE_HYDROGEN]  && !creep.carry[RESOURCE_UTRIUM] && !creep.carry[RESOURCE_LEMERGIUM] && !creep.carry[RESOURCE_KEANIUM] &&  !creep.carry[RESOURCE_ZYNTHIUM]) || !(_.findKey(creep.carry)) )
                    {
                        creep.memory.containerTarget = labs[5];
                    }
                    
                }
                else if(labs[8] && (labs[8].mineralType == RESOURCE_HYDROGEN || labs[8].mineralType == undefined) && labs[8].mineralAmount < (labs[8].mineralCapacity - creep.carryCapacity) && creep.room.terminal.store[RESOURCE_HYDROGEN] > 0)
                {
                    creep.memory.varresource = RESOURCE_HYDROGEN;
                    creep.memory.containerSource = creep.room.terminal;
                    creep.memory.containerTarget = labs[8];
                } 
                else if(labs[8] && (labs[8].mineralType != RESOURCE_HYDROGEN) && labs[8].mineralAmount > 0 && creep.room.terminal)
                {
                    creep.memory.varresource = labs[8].mineralType
                    creep.memory.containerSource = labs[8];
                    creep.memory.containerTarget = creep.room.terminal;
                } 
                else if(labs[5] && (labs[5].mineralType != RESOURCE_UTRIUM_LEMERGITE) && labs[5].mineralAmount > 0 && creep.room.terminal)
                {
                    creep.memory.varresource = labs[5].mineralType;
                    creep.memory.containerSource = labs[5];
                    creep.memory.containerTarget = creep.room.terminal;
                } 
                else
                {
                    creep.memory.varresource = RESOURCE_ENERGY;
                    
                }
            }

            if( _.sum(creep.carry) < creep.carryCapacity && creep.memory.containerSource )
            {
                var source = Game.getObjectById(creep.memory.containerSource.id);
                if(creep.memory.varresource == RESOURCE_ENERGY)
                {
                    creep.room.find(FIND_DROPPED_RESOURCES,{filter: function(object){ return object.resourceType == creep.memory.varresource}}).forEach(function(res) {
                    //var creep = res.findClosestCarrier();
                    creep.pickup(res);
                    });
                }
                if(creep.withdraw(source, creep.memory.varresource) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(source);   
                }
                else
                {
                    creep.withdraw(source, creep.memory.varresource);   
                    creep.memory.containerSource = null; 
                }
                //console.log('collect');
            }
            else if(creep.memory.containerTarget ) 
            {   
               // console.log(creep.name + 'go to target');
                
                var target = Game.getObjectById(creep.memory.containerTarget.id);
                //console.log(creep.name);
                //console.log(creep.transfer(target, _.findKey(creep.carry)));
                if(creep.transfer(target, _.findKey(creep.carry)) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);                  
                }
                else
                {
                    //console.log(creep.name + " " + creep.memory.containerTarget);
                    creep.transfer(target, _.findKey(creep.carry));  
                    creep.memory.containerTarget = null;
                }
            } 
                
        }
       // console.log(creep.name + "  " + creep.memory.containerTarget + "  " + creep.memory.varresource);

    }
}

module.exports = roleScientist;
