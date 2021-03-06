import {Process} from '../../os/process'

export class MineralHarvestProcess extends Process{
  type = AOS_MINERAL_HARVEST_PROCESS
  metaData: MetaData[AOS_MINERAL_HARVEST_PROCESS]

  run(){
    let creep = Game.creeps[this.metaData.creep]

    if(!creep || _.sum(creep.carry) === creep.carryCapacity){
      this.completed = true
      this.resumeParent()
      return
    }

    let mineral = <Mineral>Game.getObjectById(this.metaData.mineral)

    if(!creep.pos.isNearTo(mineral.pos)){
      this.fork(AOS_MOVE_PROCESS, 'move-' + creep.name, this.priority - 1, {
        creep: creep.name,
        pos: {
          x: mineral.pos.x,
          y: mineral.pos.y,
          roomName: mineral.pos.roomName
        },
        range: 1
      })

      return
    }

    let extractor = <StructureExtractor>Game.getObjectById(this.metaData.extractor)

    if(extractor.cooldown === 0){
      creep.harvest(mineral)
    }else{
      this.suspend = extractor.cooldown
    }
  }
}
