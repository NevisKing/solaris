module.exports = class AdminService {
    
    constructor(userRepo, gameRepo) {
        this.userRepo = userRepo;
        this.gameRepo = gameRepo;
    }

    async listUsers(limit) {
        let users = await this.userRepo.find({
            // All users
        }, {
            username: 1,
            email: 1,
            credits: 1,
            banned: 1,
            roles: 1,
            emailEnabled: 1,
            lastSeen: 1,
            lastSeenIP: 1,
            'achievements.rank': 1,
            'achievements.completed': 1
        }, {
            lastSeen: -1
        }, limit);

        for (let user of users) {
            user.isEstablishedPlayer = user.achievements.rank > 0 || user.achievements.completed > 0;
        }

        return users;
    }

    async listPasswordResets() {
        return await this.userRepo.find({
            resetPasswordToken: { $ne: null }
        }, {
            username: 1,
            email: 1,
            resetPasswordToken: 1
        }, {
            lastSeen: -1
        });
    }

    async listGames(limit) {
        return await this.gameRepo.find({
            'settings.general.type': { $ne: 'tutorial' } // Non tutorial games
        }, {
            'settings.general': 1,
            'state': 1
        }, {
            _id: -1
        },
        limit);
    }

    async setRoleContributor(userId, enabled = true) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'roles.contributor': enabled
        });
    }

    async setRoleDeveloper(userId, enabled = true) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'roles.developer': enabled
        });
    }

    async setRoleCommunityManager(userId, enabled = true) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'roles.communityManager': enabled
        });
    }

    async setRoleGameMaster(userId, enabled = true) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'roles.gameMaster': enabled
        });
    }

    async ban(userId) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'banned': true
        });
    }

    async unban(userId) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'banned': false
        });
    }

    async resetAchievements(userId) {
        await this.userRepo.updateOne({
            _id: userId
        }, {
            'achievements.victories': 0,
            'achievements.rank': 0,
            'achievements.eloRating': null,
            'achievements.renown': 0,
            'achievements.joined': 0,
            'achievements.completed': 0,
            'achievements.quit': 0,
            'achievements.defeated': 0,
            'achievements.afk': 0,
            'achievements.combat.kills.ships': 0,
            'achievements.combat.kills.carriers': 0,
            'achievements.combat.kills.specialists': 0,
            'achievements.combat.losses.ships': 0,
            'achievements.combat.losses.carriers': 0,
            'achievements.combat.losses.specialists': 0,
            'achievements.combat.stars.captured': 0,
            'achievements.combat.stars.lost': 0,
            'achievements.combat.homeStars.captured': 0,
            'achievements.combat.homeStars.lost': 0,
            'achievements.infrastructure.economy': 0,
            'achievements.infrastructure.industry': 0,
            'achievements.infrastructure.science': 0,
            'achievements.infrastructure.warpGates': 0,
            'achievements.infrastructure.warpGatesDestroyed': 0,
            'achievements.infrastructure.carriers': 0,
            'achievements.infrastructure.specialistsHired': 0,
            'achievements.research.scanning': 0,
            'achievements.research.hyperspace': 0,
            'achievements.research.terraforming': 0,
            'achievements.research.experimentation': 0,
            'achievements.research.weapons': 0,
            'achievements.research.banking': 0,
            'achievements.research.manufacturing': 0,
            'achievements.research.specialists': 0,
            'achievements.trade.creditsSent': 0,
            'achievements.trade.creditsReceived': 0,
            'achievements.trade.creditsSpecialistsSent': 0,
            'achievements.trade.creditsSpecialistsReceived': 0,
            'achievements.trade.technologySent': 0,
            'achievements.trade.technologyReceived': 0,
            'achievements.trade.giftsSent': 0,
            'achievements.trade.giftsReceived': 0,
            'achievements.trade.renownSent': 0
        });
    }

    async promoteToEstablishedPlayer(userId) {
        await this.userRepo.updateOne({
            _id: userId,
            $and: [
                { 'achievements.rank': { $eq: 0 }},
                { 'achievements.completed': { $eq: 0 }}
            ]
        }, {
            $inc: {
                'achievements.completed': 1
            }
        });
    }

    async setGameFeatured(gameId, featured) {
        await this.gameRepo.updateOne({
            _id: gameId
        }, {
            'settings.general.featured': featured
        });
    }

    async setGameTimeMachine(gameId, enabled) {
        await this.gameRepo.updateOne({
            _id: gameId
        }, {
            'settings.general.timeMachine': enabled
        });
    }

};
