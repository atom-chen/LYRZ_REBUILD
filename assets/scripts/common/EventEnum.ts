/**
 * Created by 郭荣凯
 * Time: 2019/04/03.
 * 用于事件枚举
 */
export enum EventEnum {
    /**
     * 玩家死亡
     */
    PLAYER_DEAD = "playerDead",
    /**
     * 玩家准备完成
     */
    PLAYER_READY = "playerReady",
    /**
     * 玩家血量变化
     */
    PLAYER_HP_CHANGE = "playerHpChange",
    /**
     * 捡起道具
     */
    PICK_PROP = "pickProp",
    /**
     * 敌人受击
     */
    ENEMY_DAMAGE = "enemyDamage",
    /**
     * 关卡完成
     */
    LEVEL_FINISH = "LevelFinish",
    /**
     * 敌人死亡
     */
    ENEMY_DEAD = "enemyDead",
}