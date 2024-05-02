game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "极略篇",
		content: function (config, pack) {

        },
		precontent: function () {

        },
		help: {},
		config: {},
		package: {
            character: {
                character: {
                    "ultimate_guanyu": ["male", "shen", "3/4/2", ["ultimate_wusheng", "lianpo", "sbshipo"], ["forbidai", "die:ext:极武将/audio/die/ultimate_guanyu.mp3"]],
                    "ultimate_wolong": ["male", "shu", "3/3/1", ["ultimate_huoji", "ultimate_kanpo", "bazhen"], ["forbidai", "die:ext:极武将/audio/die/ultimate_wolong.mp3"]],
                    "ultimate_daxiaoqiao": ["female", "wu", "4/4", ["sbtianxiang", "xinhongyan", "sbguose", "sbliuli"], ["forbidai", "die:ext:极武将/audio/die/ultimate_daxiaoqiao.mp3"]],
                    "ultimate_zhangfei": ["male", "shu", "3/4/1", ["ultimate_paoxiao", "sbxieji", "sbbenxi"], ["forbidai", "die:ext:极武将/audio/die/ultimate_zhangfei.mp3"]],
                },
				translate:{
					"ultimate_guanyu": "极关羽",
					"ultimate_wolong": "极诸葛亮",
					"ultimate_daxiaoqiao": "极大小乔",
					"ultimate_zhangfei": "极张飞",
				},
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: {
                    "ultimate_kanpo": {
                        init: function (player) {
                            if (!player.storage.ultimate_kanpo) {
                                player.storage.ultimate_kanpo = [get.mode() == 'doudizhu' ? 2 : 3, [], []];
                                player.markSkill('ultimate_kanpo');
                            }
                        },
                        audio: "sbkanpo",
                        trigger: {
                            global: "roundStart",
                        },
                        filter: function (event, player) {
                            var storage = player.storage.ultimate_kanpo;
                            return storage[0] || storage[1].length;
                        },
                        forced: true,
                        locked: false,
                        content: function* (event, map) {
                            var player = map.player, storage = player.storage.ultimate_kanpo;
                            var sum = storage[0];
                            storage[1] = [];
                            player.markSkill('ultimate_kanpo');
                            if (!sum) return;
                            const list = get.inpileVCardList(info => {
                                if (info[2] == 'sha' && info[3]) return false;
                                return info[0] != 'equip';
                            });
                            const func = () => {
                                const event = get.event();
                                const controls = [link => {
                                    const evt = get.event();
                                    if (evt.dialog && evt.dialog.buttons) {
                                        for (let i = 0; i < evt.dialog.buttons.length; i++) {
                                            const button = evt.dialog.buttons[i];
                                            button.classList.remove('selectable');
                                            button.classList.remove('selected');
                                            const counterNode = button.querySelector('.caption');
                                            if (counterNode) {
                                                counterNode.childNodes[0].innerHTML = ``;
                                            }
                                        }
                                        ui.selected.buttons.length = 0;
                                        game.check();
                                    }
                                    return;
                                }];
                                event.controls = [ui.create.control(controls.concat(['清除选择', 'stayleft']))];
                            };
                            if (event.isMine()) func();
                            else if (event.isOnline()) event.player.send(func);
                            var result = yield player.chooseButton(['看破：是否记录至多' + get.cnNumber(sum) + '个牌名？', [list, 'vcard']], [1, sum], false).set('ai', function (button) {
                                if (ui.selected.buttons.length >= Math.max(3, game.countPlayer() / 2)) return 0;
                                switch (button.link[2]) {
                                    case 'wuxie': return 5 + Math.random();
                                    case 'sha': return 5 + Math.random();
                                    case 'tao': return 4 + Math.random();
                                    case 'jiu': return 3 + Math.random();
                                    case 'lebu': return 3 + Math.random();
                                    case 'shan': return 4.5 + Math.random();
                                    case 'wuzhong': return 4 + Math.random();
                                    case 'shunshou': return 2.7 + Math.random();
                                    case 'nanman': return 2 + Math.random();
                                    case 'wanjian': return 1.6 + Math.random();
                                    default: return 1.5 + Math.random();
                                }
                            }).set('filterButton', button => {
                                return !_status.event.names.includes(button.link[2]);
                            }).set('names', storage[2]).set('custom', {
                                add: {
                                    confirm: function (bool) {
                                        if (bool != true) return;
                                        const event = get.event().parent;
                                        if (event.controls) event.controls.forEach(i => i.close());
                                        if (ui.confirm) ui.confirm.close();
                                        game.uncheck();
                                    },
                                    button: function () {
                                        if (ui.selected.buttons.length) return;
                                        const event = get.event();
                                        if (event.dialog && event.dialog.buttons) {
                                            for (let i = 0; i < event.dialog.buttons.length; i++) {
                                                const button = event.dialog.buttons[i];
                                                const counterNode = button.querySelector('.caption');
                                                if (counterNode) {
                                                    counterNode.childNodes[0].innerHTML = ``;
                                                }
                                            }
                                        }
                                        if (!ui.selected.buttons.length) {
                                            const evt = event.parent;
                                            if (evt.controls) evt.controls[0].classList.add('disabled');
                                        }
                                    },
                                },
                                replace: {
                                    button: function (button) {
                                        const event = get.event(), sum = event.sum;
                                        if (!event.isMine()) return;
                                        if (button.classList.contains('selectable') == false) return;
                                        if (ui.selected.buttons.length >= sum) return false;
                                        button.classList.add('selected');
                                        ui.selected.buttons.push(button);
                                        let counterNode = button.querySelector('.caption');
                                        const count = ui.selected.buttons.filter(i => i == button).length;
                                        if (counterNode) {
                                            counterNode = counterNode.childNodes[0];
                                            counterNode.innerHTML = `×${count}`;
                                        }
                                        else {
                                            counterNode = ui.create.caption(`<span style="font-size:24px; font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
                                            counterNode.style.right = '5px';
                                            counterNode.style.bottom = '2px';
                                        }
                                        const evt = event.parent;
                                        if (evt.controls) evt.controls[0].classList.remove('disabled');
                                        game.check();
                                    },
                                }
                            }).set('sum', sum)
                            if (result.bool) {
                                var names = result.links.map(link => link[2]);
                                // storage[0]-=names.length; // 删除数量限制
                                storage[1] = names;
                                storage[2] = names;
                            }
                            else storage[2] = [];
                            player.markSkill('ultimate_kanpo');
                        },
                        marktext: "看破",
                        intro: {
                            markcount: function (storage, player) {
                                if (player.isUnderControl(true)) return storage[1].length;
                                return '?';
                            },
                            mark: function (dialog, content, player) {
                                if (player.isUnderControl(true)) {
                                    const storage = player.getStorage('ultimate_kanpo');
                                    const sum = storage[0];
                                    const names = storage[1];
                                    // dialog.addText('剩余可记录'+sum+'次牌名');
                                    if (names.length) {
                                        dialog.addText('已记录牌名：');
                                        dialog.addSmall([names, 'vcard']);
                                    }
                                }
                            },
                        },
                        group: "ultimate_kanpo_kanpo",
                        subSkill: {
                            kanpo: {
                                audio: "sbkanpo",
                                trigger: {
                                    global: "useCard",
                                },
                                filter: function (event, player) {
                                    return event.player != player && player.storage.ultimate_kanpo[1].includes(event.card.name);
                                },
                                "prompt2": function (event, player) {
                                    return '移除' + get.translation(event.card.name) + '的记录，令' + get.translation(event.card) + '无效';
                                },
                                check: function (event, player) {
                                    var effect = 0;
                                    if (event.card.name == 'wuxie' || event.card.name == 'shan') {
                                        if (get.attitude(player, event.player) < -1) effect = -1;
                                    }
                                    else if (event.targets && event.targets.length) {
                                        for (var i = 0; i < event.targets.length; i++) {
                                            effect += get.effect(event.targets[i], event.card, event.player, player);
                                        }
                                    }
                                    if (effect < 0) {
                                        if (event.card.name == 'sha') {
                                            var target = event.targets[0];
                                            if (target == player) return !player.countCards('h', 'shan');
                                            else return target.hp == 1 || (target.countCards('h') <= 2 && target.hp <= 2);
                                        }
                                        else return true;
                                    }
                                    return false;
                                },
                                logTarget: "player",
                                content: function () {
                                    player.storage.ultimate_kanpo[1].remove(trigger.card.name);
                                    player.markSkill('ultimate_kanpo');
                                    trigger.targets.length = 0;
                                    trigger.all_excluded = true;
                                    player.draw();
                                },
                                sub: true,
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "ultimate_huoji": {
                        // audio: "sbhuoji",
                        group: ["ultimate_huoji_fire", "ultimate_huoji_mark"],
                        subSkill: {
                            fire: {
                                audio: "sbhuoji1",
                                enable: "phaseUse",
                                filterTarget: function (card, player, target) {
                                    return player != target;
                                },
                                prompt: "选择一名其他角色，对其与其势力相同的所有角色（除你以外）各造成1点火属性伤害",
                                usable: 1,
                                line: "fire",
                                content: function () {
                                    'step 0'
                                    target.damage('fire');
                                    'step 1'
                                    var targets = game.filterPlayer(current => {
                                        if (current == player) return false;
                                        return current.group == target.group;
                                    });
                                    if (targets.length) {
                                        game.delayx();
                                        player.line(targets, 'fire');
                                        targets.forEach(i => i.damage('fire'));
                                    }
                                },
                                ai: {
                                    order: 7,
                                    fireAttack: true,
                                    result: {
                                        target: function (player, target) {
                                            var att = get.attitude(player, target);
                                            return get.sgn(att) * game.filterPlayer(current => {
                                                if (current == player) return false;
                                                return current.group == target.group;
                                            }).reduce((num, current) => num + get.damageEffect(current, player, player, 'fire'), 0);
                                        },
                                    },
                                },
                                sub: true,
                                "_priority": 0,
                            },
                            mark: {
                                charlotte: true,
                                trigger: {
                                    source: "damage",
                                },
                                filter: function (event, player) {
                                    return event.hasNature('fire');
                                },
                                firstDo: true,
                                forced: true,
                                popup: false,
                                content: function () {
                                    player.addTempSkill('ultimate_huoji_count', { player: ['sbhuoji_achieveBegin', 'sbhuoji_failBegin'] });
                                    player.storage.ultimate_huoji_count = player.getAllHistory('sourceDamage', evt => evt.hasNature('fire')).reduce((num, evt) => num + evt.num, 0);
                                    player.markSkill('ultimate_huoji_count');
                                },
                                sub: true,
                                "_priority": 0,
                            },
                            count: {
                                charlotte: true,
                                intro: {
                                    content: "本局游戏已造成过#点火属性伤害",
                                },
                                sub: true,
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "ultimate_wusheng": {
                        audio: "sbwusheng",
                        trigger: {
                            player: "phaseUseBegin",
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(target => target != player);
                        },
                        direct: true,
                        content: function* (event, map) {
                            var player = map.player;
                            var result = yield player.chooseTarget(get.prompt('ultimate_wusheng'), '选择一名其他角色，本阶段对其使用【杀】无距离和次数限制，使用【杀】指定其为目标后摸' + (get.mode() === 'identity' ? '两' : '一') + '张牌，对其使用五张【杀】后不能对其使用【杀】', (card, player, target) => {
                                return target != player;
                            }).set('ai', target => {
                                var player = _status.event.player;
                                return get.effect(target, { name: 'sha' }, player, player);
                            });
                            if (result.bool) {
                                var target = result.targets[0];
                                player.logSkill('ultimate_wusheng', target);
                                if (get.mode() !== 'identity' || player.identity !== 'nei') player.addExpose(0.25);
                                player.addTempSkill('ultimate_wusheng_effect', { player: 'phaseUseAfter' });
                                player.storage.ultimate_wusheng_effect[target.playerid] = 0;
                            }
                        },
                        group: "ultimate_wusheng_wusheng",
                        subSkill: {
                            wusheng: {
                                audio: "sbwusheng",
                                enable: ["chooseToUse", "chooseToRespond"],
                                hiddenCard: function (player, name) {
                                    return name == 'sha' && player.countCards('hs');
                                },
                                filter: function (event, player) {
                                    return event.filterCard({ name: 'sha' }, player, event) || lib.inpile_nature.some(nature => event.filterCard({ name: 'sha', nature: nature }, player, event));
                                },
                                chooseButton: {
                                    dialog: function (event, player) {
                                        var list = [];
                                        if (event.filterCard({ name: 'sha' }, player, event)) list.push(['基本', '', 'sha']);
                                        for (var j of lib.inpile_nature) {
                                            if (event.filterCard({ name: 'sha', nature: j }, player, event)) list.push(['基本', '', 'sha', j]);
                                        }
                                        var dialog = ui.create.dialog('武圣', [list, 'vcard'], 'hidden');
                                        dialog.direct = true;
                                        return dialog;
                                    },
                                    check: function (button) {
                                        var player = _status.event.player;
                                        var card = { name: button.link[2], nature: button.link[3] };
                                        if (_status.event.getParent().type == 'phase' && game.hasPlayer(function (current) {
                                            return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                                        })) {
                                            switch (button.link[2]) {
                                                case 'sha':
                                                    if (button.link[3] == 'fire') return 2.95;
                                                    else if (button.link[3] == 'thunder' || button.link[3] == 'ice') return 2.92;
                                                    else return 2.9;
                                            }
                                        }
                                        return 1 + Math.random();
                                    },
                                    backup: function (links, player) {
                                        return {
                                            audio: 'sbwusheng',
                                            filterCard: true,
                                            check: function (card) {
                                                return 6 - get.value(card);
                                            },
                                            viewAs: { name: links[0][2], nature: links[0][3] },
                                            position: 'hs',
                                            popname: true,
                                        }
                                    },
                                    prompt: function (links, player) {
                                        return '将一张手牌当作' + get.translation(links[0][3] || '') + '【' + get.translation(links[0][2]) + '】' + (_status.event.name == 'chooseToUse' ? '使用' : '打出');
                                    },
                                },
                                ai: {
                                    respondSha: true,
                                    fireAttack: true,
                                    skillTagFilter: function (player, tag) {
                                        if (!player.countCards('hs')) return false;
                                    },
                                    order: function (item, player) {
                                        if (player && _status.event.type == 'phase') {
                                            var max = 0;
                                            if (lib.inpile_nature.some(i => player.getUseValue({ name: 'sha', nature: i }) > 0)) {
                                                var temp = get.order({ name: 'sha' });
                                                if (temp > max) max = temp;
                                            }
                                            if (max > 0) max += 0.3;
                                            return max;
                                        }
                                        return 4;
                                    },
                                    result: {
                                        player: 1,
                                    },
                                },
                                sub: true,
                                "_priority": 0,
                            },
                            effect: {
                                charlotte: true,
                                onremove: true,
                                init: function (player) {
                                    if (!player.storage.ultimate_wusheng_effect) player.storage.ultimate_wusheng_effect = {};
                                },
                                mod: {
                                    targetInRange: function (card, player, target) {
                                        if (card.name == 'sha' && typeof player.storage.ultimate_wusheng_effect[target.playerid] == 'number') return true;
                                    },
                                    cardUsableTarget: function (card, player, target) {
                                        if (card.name !== 'sha' || typeof player.storage.ultimate_wusheng_effect[target.playerid] !== 'number') return;
                                        return player.storage.ultimate_wusheng_effect[target.playerid] < 5;
                                    },
                                    playerEnabled: function (card, player, target) {
                                        if (card.name != 'sha' || typeof player.storage.ultimate_wusheng_effect[target.playerid] != 'number') return;
                                        if (player.storage.ultimate_wusheng_effect[target.playerid] >= 5) return false;
                                    },
                                },
                                audio: "sbwusheng",
                                trigger: {
                                    player: ["useCardToPlayered", "useCardAfter"],
                                },
                                filter: function (event, player) {
                                    if (event.card.name != 'sha') return false;
                                    if (event.name == 'useCard') return event.targets.some(target => typeof player.storage.ultimate_wusheng_effect[target.playerid] == 'number');
                                    return typeof player.storage.ultimate_wusheng_effect[event.target.playerid] == 'number';
                                },
                                direct: true,
                                content: function () {
                                    if (trigger.name == 'useCard') {
                                        var targets = trigger.targets.filter(target => typeof player.storage.ultimate_wusheng_effect[target.playerid] == 'number');
                                        targets.forEach(target => player.storage.ultimate_wusheng_effect[target.playerid]++);
                                    }
                                    else {
                                        player.logSkill('ultimate_wusheng_effect', trigger.target);
                                        player.draw();
                                    }
                                },
                                sub: true,
                                "_priority": 0,
                            },
                        },
                        ai: {
                            threaten: 114514,
                        },
                        "_priority": 0,
                    },
                    "ultimate_paoxiao": {
                        audio: "sbpaoxiao",
                        mod: {
                            cardUsable: function (card) {
                                if (card.name == 'sha') return Infinity;
                            },
                            targetInRange: function (card, player, target) {
                                if (card.name == 'sha' && player.getEquips(1).length > 0) return true;
                            },
                        },
                        trigger: {
                            player: "useCard",
                        },
                        forced: true,
                        filter: function (event, player) {
                            if (event.card.name != 'sha') return false;
                            var evt = event.getParent('phaseUse');
                            if (!evt || evt.player != player) return false;
                            return player.hasHistory('useCard', function (evtx) {
                                return evtx != event && evtx.card.name == 'sha' && evtx.getParent('phaseUse') == evt;
                            }, event);
                        },
                        content: function () {
                            if (!trigger.card.storage) trigger.card.storage = {};
                            trigger.card.storage.ultimate_paoxiao = true;
                            trigger.baseDamage++;
                            trigger.directHit.addArray(game.players);
                            player.addTempSkill('ultimate_paoxiao_effect', 'phaseUseAfter');
                        },
                        subSkill: {
                            effect: {
                                charlotte: true,
                                trigger: {
                                    player: "useCardToPlayered",
                                },
                                forced: true,
                                popup: false,
                                filter: function (event, player) {
                                    return event.card.storage && event.card.storage.ultimate_paoxiao && event.target.isIn();
                                },
                                content: function () {
                                    trigger.target.addTempSkill('fengyin');
                                },
                                group: "ultimate_paoxiao_recoil",
                                sub: true,
                                "_priority": 0,
                            },
                            recoil: {
                                charlotte: true,
                                trigger: {
                                    source: "damageSource",
                                },
                                forced: true,
                                filter: function (event, player) {
                                    return event.card && event.card.storage && event.card.storage.ultimate_paoxiao && event.player.isIn();
                                },
                                content: function () {
									/*
                                    'step 0'
                                    player.loseHp();
                                    'step 1'
                                    var hs = player.getCards('h', function (card) {
                                        return lib.filter.cardDiscardable(card, player, 'ultimate_paoxiao_recoil');
                                    });
                                    if (hs.length > 0) player.discard(hs.randomGet());
									*/
                                },
                                sub: true,
                                "_priority": 0,
                            },
                        },
                    },
                },
                translate: {
                    ultimate_kanpo: "看破",
                    ultimate_kanpo_info: "①一轮游戏开始时，你清除〖看破①〗记录的牌名，然后你可以依次记录任意个未于上次发动〖看破①〗记录清除过的非装备牌牌名（对其他角色不可见，每轮至多3个）。②其他角色使用你〖看破①〗记录过的牌名的牌时，你可以移去一个〖看破①〗中的此牌名的记录令此牌无效，然后你摸一张牌。",
                    ultimate_huoji: "火计",
                    ultimate_huoji_info: "出牌阶段限一次。你可以对一名其他角色造成1点火焰伤害，然后你对所有与其势力相同的不为其的其他角色各造成1点火焰伤害。",
                    ultimate_wusheng: "武圣",
                    ultimate_wusheng_info: "你可以将一张手牌当作任意【杀】使用或打出。出牌阶段开始时，你可以选择一名其他角色，本阶段对其使用【杀】无距离和次数限制，使用【杀】指定其为目标后摸一张牌，对其使用五张【杀】后不能对其使用【杀】。",
                    ultimate_paoxiao: "咆哮",
                    ultimate_paoxiao_info: "锁定技。①你使用【杀】无次数限制。②若你的装备区内有武器牌，则你使用【杀】无距离限制。③当你于出牌阶段内使用第二张及以后【杀】时，你获得如下效果：{此【杀】不可被响应且伤害值基数+1；此【杀】指定目标后，目标角色的非锁定技于本回合内失效。}",
                },
            },
            intro: "主要在谋攻篇的基础上进行调整，大部分为加强，以及一些角色技能的合理化（如丞相）",
            author: "jcShan709",
            diskURL: "https://github.com/jcshan709/ultimate-heroes",
            forumURL: "https://github.com/jcshan709/ultimate-heroes/issues",
            version: "3.1",
        },
		files: { "character": ["ultimate_wolong.jpg", "ultimate_daxiaoqiao.jpg", "ultimate_zhangfei.jpg", "ultimate_guanyu.jpg"], "card": [], "skill": [], "audio": [] }
    }
})
