import * as alt from "alt-server"

class Callbacks {
    private callbacks: Record<string, (player: alt.Player, args: any[]) => any> = {}

    init() {
        alt.onClient("network:requestCallback", (player: alt.Player, id: number, key: string, args: any[]) => {
            alt.emitClient(player, "network:sendCallback", id, this.callbacks[key](player, args))
        })
        this.callbacks["vehicle:create"] = (player, args) => {
            try {
                let vehicle = new alt.Vehicle(args[0], player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z)
                vehicle.modKit = 1
                vehicle.dirtLevel = 0
                vehicle.engineOn = true
                vehicle.numberPlateText = "trainer"
                return vehicle
            } catch (error) { alt.logError(error); return undefined }
        }
        this.callbacks["vehicle:setMod"] = (_, args) => {
            try {
                let vehicle = args[0] as alt.Vehicle
                vehicle.modKit = 1
                vehicle.setMod(args[1], args[2])
            } catch (error) { alt.logError(error) }
        }
        this.callbacks["vehicle:setWheels"] = (_, args) => {
            try {
                let vehicle = args[0] as alt.Vehicle
                vehicle.modKit = 1
                vehicle.setWheels(args[1], args[2])
                if (args[3])
                    vehicle.setRearWheels(args[2])
            } catch (error) { alt.logError(error) }
        }
        this.callbacks["vehicle:delete"] = (_, args) => {
            (args[0] as alt.Vehicle).destroy()
        }
        this.callbacks["vehicle:repair"] = (_, args) => {
            let vehicle = args[0] as alt.Vehicle
            vehicle.bodyAdditionalHealth = vehicle.bodyHealth = vehicle.engineHealth = vehicle.petrolTankHealth = 1000
        }
        this.callbacks["vehicle:clean"] = (_, args) => {
            let vehicle = args[0] as alt.Vehicle
            vehicle.dirtLevel = 0
        }
        this.callbacks["vehicle:setColor"] = (_, args) => {
            let vehicle = args[0] as alt.Vehicle
            switch (args[1]) {
                case 0:
                    vehicle.primaryColor = args[2]
                    break
                case 1:
                    vehicle.secondaryColor = args[2]
                    break
                case 2:
                    vehicle.pearlColor = args[2]
                    break
                case 3:
                    vehicle.wheelColor = args[2]
                    break
                default:
                    throw new Error()
            }
        }
        this.callbacks["player:respawn"] = (player, _) => {
            player.spawn(player.pos.x, player.pos.y, player.pos.z, 0)
        }
        this.callbacks["player:heal"] = (player, _) => {
            player.health = player.maxHealth
            player.armour = player.maxArmour
        }
        this.callbacks["player:setModel"] = (player, args) => {
            player.model = args[0]
        }
        this.callbacks["player:giveWeapon"] = (player, args) => {
            player.giveWeapon(args[0], args[1], args[2])
        }
        this.callbacks["player:removeWeapon"] = (player, args) => {
            player.removeWeapon(args[0])
        }
        this.callbacks["player:removeAllWeapons"] = (player, _) => {
            player.removeAllWeapons()
        }
        this.callbacks["player:addWeaponComponent"] = (player, args) => {
            player.addWeaponComponent(args[0], args[1])
        }
        this.callbacks["player:removeWeaponComponent"] = (player, args) => {
            player.removeWeaponComponent(args[0], args[1])
        }
        this.callbacks["game:teleportPlayerToEntity"] = (_, args) => {
            alt.emitClient(args[0], "player:teleportToEntity", args[1])
        }
        this.callbacks["game:getPlayerIdentifiers"] = (_, args) => {
            let target = args[0] as alt.Player
            return [target.hwidHash, target.hwidExHash, target.socialID]
        }
        this.callbacks["game:setTime"] = (_, args) => {
            alt.Player.all.forEach(player => player.setDateTime(0, 0, 0, args[0], args[1], args[2]))
        }
        this.callbacks["game:setWeather"] = (_, args) => {
            alt.Player.all.forEach(player => player.setWeather(args[0]))
        }
        this.callbacks["game:setCloudHat"] = (_, args) => {
            alt.emitClient(null, "world:setCloudHat", args[0])
        }
        this.callbacks["game:setCloudHatOpacity"] = (_, args) => {
            alt.emitClient(null, "world:setCloudHatOpacity", args[0])
        }
        this.callbacks["game:setArtificialLightsState"] = (_, args) => {
            alt.emitClient(null, "world:setArtificialLightsState", args[0])
        }
    }
}

export const callbacks = new Callbacks()
