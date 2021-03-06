import {Process} from '../../os/process'

export class HarvestProcess extends Process{
  metaData: MetaData[AOS_HARVEST_PROCESS]
  type = AOS_HARVEST_PROCESS

  run(){
    let creep = Game.creeps[this.metaData.creep]

    if(!creep || _.sum(creep.carry) === creep.carryCapacity){
      this.completed = true
      this.resumeParent()
      return
    }

    let source = <Source>Game.getObjectById(this.metaData.source)

    let targetPos = source.pos
    let targetRange = 1

    if(this.kernel.data.roomData[source.room.name].sourceContainerMaps[source.id]){
      targetPos = this.kernel.data.roomData[source.room.name].sourceContainerMaps[source.id].pos
      targetRange = 0
    }

    if(!creep.pos.inRangeTo(targetPos, targetRange)){
      this.fork(AOS_MOVE_PROCESS, creep.name + '-harvest-move', this.priority + 1, {
        creep: creep.name,
        pos: {
          x: targetPos.x,
          y: targetPos.y,
          roomName: targetPos.roomName
        },
        range: targetRange
      })
    }else{
      if(creep.harvest(source) === ERR_NOT_ENOUGH_RESOURCES){
        this.suspend = source.ticksToRegeneration
      }
    }
  }
}
