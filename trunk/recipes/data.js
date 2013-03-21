var components = [
  {id:'mater292',count:0, used:0, name:'Кристальный песок', is_material:true},
  {id:'mater293',count:0, used:0, name:'Мерцающий кристалл', is_material:true},
  {id:'mater294',count:0, used:0, name:'Слезы лунного мерцания', is_material:true},
  {id:'mater295',count:0, used:0, name:'Чешуйчатая шкура', is_material:true},
  {id:'mater296',count:0, used:0, name:'Самородок мерцающего металла', is_material:true},
  {id:'mater297',count:0, used:0, name:'Изменчивые водоросли',is_material:true},
  {id:'mater298',count:0, used:0, name:'Древний мох', is_material:true},
  {id:'mater299',count:0, used:0, name:'Черное масло', is_material:true},
  {id:'mater300',count:0, used:0, name:'Бурая шкура', is_material:true},
  {id:'mater355',count:0, used:0, name:'Глазные яблоки Проклятия Глубин', is_material:true},
  {id:'mater367',count:0, used:0, name:'Кости Проклятия Болот', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true}
/*
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
  {id:'', count:0, used:0, name:'', is_material:true},
*/
/* Устарело
  {id:'mater1', count:0, used:0, name:'Шкура пещерного оленя', is_material:true},
  {id:'mater2', count:0, used:0, name:'Золото', is_material:true},
  {id:'mater3', count:0, used:0, name:'Серебро', is_material:true},
  {id:'mater4', count:0, used:0, name:'Лучистое серебро', is_material:true},
  {id:'mater5', count:0, used:0, name:'Мифрил', is_material:true},
  {id:'mater6', count:0, used:0, name:'Железное дерево', is_material:true},
  {id:'mater7', count:0, used:0, name:'Слиток пустынной руды', is_material:true},
  {id:'mater8', count:0, used:0, name:'Троекорень', is_material:true},
  {id:'mater9', count:0, used:0, name:'Корень змеиного дерева', is_material:true},
  {id:'mater10', count:0, used:0, name:'Кора змеиного дерева', is_material:true},
  {id:'mater11', count:0, used:0, name:'Кожа Общего Врага', is_material:true},
  {id:'mater12', count:0, used:0, name:'Сталь', is_material:true},
  {id:'mater13', count:0, used:0, name:'Кристалл тысячи ответов', is_material:true},
  {id:'mater14', count:0, used:0, name:'Сгусток эфира', is_material:true},
  {id:'mater15', count:0, used:0, name:'Сгусток астрала', is_material:true},
  {id:'mater16', count:0, used:0, name:'Глубинный камень', is_material:true},
  {id:'mater17', count:0, used:0, name:'Плод змеиного дерева', is_material:true},
  {id:'mater18', count:0, used:0, name:'Тысячелетний камень', is_material:true},
  {id:'mater19', count:0, used:0, name:'Кристалл времен', is_material:true},
  {id:'mater20', count:0, used:0, name:'Эссенция лунного света', is_material:true},
  {id:'mater21', count:0, used:0, name:'Эссенция глубины', is_material:true},
  {id:'mater22', count:0, used:0, name:'Эссенция чистоты', is_material:true},
  {id:'mater23', count:0, used:0, name:'Ралиэль', is_material:true},
  {id:'mater24', count:0, used:0, name:'Стихиалия', is_material:true},
  {id:'mater25', count:0, used:0, name:'Кристалл голоса предков', is_material:true},
  {id:'mater26', count:0, used:0, name:'Кристалл стабильности', is_material:true},
  {id:'mater27', count:0, used:0, name:'Камень затаенного солнца', is_material:true},
  {id:'mater28', count:0, used:0, name:'Лучистый рубин', is_material:true},
  {id:'mater29', count:0, used:0, name:'Лучистый топаз', is_material:true},
  {id:'mater30', count:0, used:0, name:'Шепот гор', is_material:true},
  {id:'mater31', count:0, used:0, name:'Эссенция праведного гнева', is_material:true},
  {id:'mater294',count:0, used:0, name:'Слезы лунного мерцания', is_material:true},
  {id:'mater295',count:0, used:0, name:'Чешуйчатая шкура', is_material:true},
  {id:'mater296',count:0, used:0, name:'Самородок мерцающего металла', is_material:true},
  {id:'mater298',count:0, used:0, name:'Древний мох', is_material:true},
  {id:'mater299',count:0, used:0, name:'Черное масло', is_material:true},
  {id:'mater300',count:0, used:0, name:'Бурая шкура', is_material:true}
*/
];

var locations = [
  'Все возможные места использования',
  'Оружие и аммуниция в магазинах',
  'Мастерская в ПТП',
  'Фонтан зачарованных гор в ПТП',
  'Лаборатория в Бездне',
  'Наковальня в Бездне',
  'Цветочный магазин',
  'Туманные низины',
  'Переносная лаборатория',
  'Прочие места'
];

var recipes = [
  {name:'invoke_tn_wresist', descr:'Синяя плюшка', comp:['tn_blue_slime',1], location:6, possible:0, accepted:0},
  {name:'invoke_tn_aresist', descr:'Лиловая плюшка', comp:['tn_purple_slime',1], location:6, possible:0, accepted:0},
  {name:'invoke_tn_fresist', descr:'Оранжевая плюшка', comp:['tn_orange_slime',1], location:6, possible:0, accepted:0},
  {name:'invoke_tn_eresist', descr:'Зелёная плюшка', comp:['tn_green_slime',1], location:6, possible:0, accepted:0},
  {name:'invoke_pm_digger_candle', descr:'Коробка со свечками', comp:['pm_coal',3], location:8, possible:0, accepted:0},
  {name:'chim_tcure', descr:'Кожаный бинт', comp:['pm_skin',5], location:7, possible:0, accepted:0},
  {name:'bag0927', descr:'Вещмешок', comp:['pm_skin',15,'pm_bones',1], location:7, possible:0, accepted:0},
  {name:'bag0928', descr:'Мешочек', comp:['pm_skin',15,'pm_bones',1], location:7, possible:0, accepted:0},
  {name:'tn3_door_pass', descr:'Пропуск в жилую часть', comp:['tn3_slimemeat',5], location:6, possible:0, accepted:0},
  {name:'tn3_door_pass', descr:'Пропуск в жилую часть', comp:['tn3_larvameat',5], location:6, possible:0, accepted:0},



/*  
//Для сбора Черной Метки у вас должны быть: Сталь, Глубинный камень, Плод змеиного дерева, Тысячелетний камень, Лучистый рубин, Лучистый топаз.  
//Для сбора Красной Метки у вас должны быть: Лучистое серебро, Сгусток эфира (3 шт.), Кристалл голоса предков, Камень затаенного солнца, Шепот гор, Эссенция праведного гнева, Стихиалия.
//Для сбора свитка "Проклятье Умирающей Земли" у вас должны быть: Кристалл голоса предков, Кристалл стабильности.
//Для сбора свитка "Проклятье Стихающего Ветра" у вас должны быть: Сталь, Сгусток астрала, Плод змеиного дерева, Тысячелетний камень, Шепот гор.
//Для сбора свитка "Проклятье Замерзающей Воды" у вас должны быть: Кожа змеиного дерева, Глубинный камень, Тысячелетний камень, Кристалл времен, Камень затаенного солнца.
//Для сбора свитка "Проклятье Угасающего Огня" у вас должны быть: Кожа Общего Врага, Сгусток эфира, Плод змеиного дерева, Тысячелетний камень, Лучистый топаз.
//Для сбора свитка "Проклятье Легкого Отупления" у вас должны быть: Кристалл стабильности, Лучистый рубин, Стихиалия.
//Для сбора свитка "Проклятье Уязвимости" у вас должны быть: Кристалл стабильности, Лучистый рубин, Стихиалия.
//Для сбора свитка "Зачаровать кольцо: Вытягивание души [1]" у вас должны быть: Кристалл тысячи ответов, Сгусток эфира, Сгусток астрала.
//Для сбора свитка "Зачаровать кольцо: Вытягивание души [2]" у вас должны быть: свиток "Зачаровать кольцо: Вытягивание души [1]", Топливо для Големов, Смазка для Големов, Ускоритель для Големов.

  
  {name:'spell_ug_undam4c', descr:'Проклятье Умирающей Земли', comp:['mater25', 1, 'mater26', 1], location:1, possible:0, accepted:0},
  {name:'spell_ug_undam1c', descr:'Проклятье Угасающего Огня', comp:['mater11', 1, 'mater14', 1, 'mater17', 1, 'mater18', 1, 'mater29', 1], location:1, possible:0, accepted:0}, // проверено
  {name:'spell_ug_undam2c', descr:'Проклятье Замерзающей Воды', comp:['mater10', 1, 'mater16', 1, 'mater18', 1, 'mater19', 1, 'mater27', 1], location:1, possible:0, accepted:0},
  {name:'spell_ug_undam3c', descr:'Проклятье Стихающего Ветра', comp:['mater12', 1, 'mater15', 1, 'mater17', 1, 'mater18', 1, 'mater30', 1], location:1, possible:0, accepted:0},
  {name:'spell_ug_unp10c', descr:'Проклятье Уязвимости', comp:['mater26', 1, 'mater28', 1, 'mater24', 1], location:1, possible:0, accepted:0},
  {name:'spell_ug_unexprc', descr:'Проклятье Легкого Отупения', comp:['mater28', 1, 'mater26', 1, 'mater24', 1], location:1, possible:0, accepted:0},
  {name:'spell_curse', descr:'Черная Метка', comp:['mater12', 1, 'mater28', 1, 'mater16', 1, 'mater17', 1, 'mater18', 1, 'mater29', 1], location:1, possible:0, accepted:0},
//  {name:'spell_curseb', descr:'Красная Метка', comp:['mater14', 1, 'mater4', 1, 'mater25', 1, 'mater11', 1], location:1, possible:0, accepted:0}, // не работает

//  {name:'spell_repare_1', descr:'Свиток починки 1', comp:['mater17', 2, 'mater10', 1, 'mater1', 1, 'mater3', 1], location:1, possible:0, accepted:0},
//  {name:'spell_repare_3', descr:'Свиток починки 3', comp:['mater8', 1, 'mater15', 1, 'mater1', 1, 'mater4', 1], location:1, possible:0, accepted:0},
//  {name:'spell_repare_5', descr:'Свиток починки 5', comp:['mater12', 1, 'mater15', 1, 'mater7', 2], location:1, possible:0, accepted:0},
//  {name:'spell_repare_7', descr:'Свиток починки 7', comp:['mater17', 1, 'mater7', 1, 'mater8', 1], location:1, possible:0, accepted:0},
//  {name:'spell_repare_10', descr:'Свиток починки 10', comp:['mater4', 1, 'mater17', 1, 'mater7', 1, 'mater28', 1, 'mater9', 1], location:1, possible:0, accepted:0},

//  {name:'ring116', descr:'Кольцо Кровавой Луны', comp:['mater25', 1, 'mater21', 3], location:1, possible:0, accepted:0},
//  {name:'ring116_1', descr:'Кольцо Кровавой Луны [10]', comp:['sp_mat3', 1, 'mater27', 1, 'mater16', 3, 'mater4', 1], location:4, possible:0, accepted:0},

//  {name:'ring110', descr:'Кольцо Паука', comp:['mater30', 1, 'mater23', 3], location:1, possible:0, accepted:0},
//  {name:'ring110_1', descr:'Кольцо Паука [10]', comp:['mater30', 1, 'mater23', 3, 'sp_mat3', 1, 'mater25', 1, 'mater17', 3, 'mater12', 1], location:4, possible:0, accepted:0},

//  {name:'ring117', descr:'Кольцо Забытых Времен', comp:['mater25', 1, 'mater21', 3], location:1, possible:0, accepted:0},
//  {name:'ring117_1', descr:'Кольцо Забытых Времен [10]', comp:['sp_mat3', 1, 'mater27', 1, 'mater16', 3, 'mater4', 1], location:4, possible:0, accepted:0},

//  {name:'ring83', descr:'Кольцо Интуиции', comp:['mater2', 5, 'mater11', 2, 'mater14', 1, 'mater15', 2], location:1, possible:0, accepted:0},
//  {name:'ring83', descr:'Кольцо Интуиции', comp:['mater1', 2, 'mater6', 5, 'mater19', 1], location:1, possible:0, accepted:0},  // не работает

//  {name:'ring85', descr:'Кольцо ловкости', comp:['mater3',5,'mater10',2,'mater17',1,'mater18',1,'mater19',1], location:1, possible:0, accepted:0}, // проверено
//  {name:'ring85', descr:'Кольцо ловкости', comp:['mater3',5,'mater7',2,'mater18',1], location:1, possible:0, accepted:0}, // не работает

//  {name:'ring106', descr:'Рубиновое Кольцо', comp:['mater4', 3, 'mater7', 2, 'mater8', 4, 'mater13', 3], location:1, possible:0, accepted:0}, // проверено
//  {name:'ring106', descr:'Рубиновое Кольцо', comp:['mater1', 3, 'mater8', 2, 'mater11', 2, 'mater14', 1], location:1, possible:0, accepted:0}, // не работает
//  {name:'ring106', descr:'Рубиновое Кольцо', comp:['mater4', 3, 'mater7', 3, 'mater8', 4], location:1, possible:0, accepted:0}, // не работает

//  {name:'ring207', descr:'Simplicity Ring', comp:['mater12', 2, 'mater13', 3, 'mater28', 1, 'mater29', 1], location:1, possible:0, accepted:0},
//  {name:'ring104', descr:'Кольцо силы', comp:['mater1',4,'mater5',4,'mater9',3,'mater16',2,'mater19',1], location:1, possible:0, accepted:0}, // проверено
//  {name:'ring99', descr:'Синее кольцо учителя', comp:['mater6',5,'mater15',2,'mater26',2,'mater22',1], location:1, possible:0, accepted:0}, // проверено

  {name:'boots22', descr:'Ботинки Кровавой Луны [10]', comp:['sp_mat1', 1, 'mater30', 3], location:4, possible:0, accepted:0},
  {name:'boots21', descr:'Сапоги Паука [10]', comp:['sp_mat1', 1, 'mater29', 3], location:4, possible:0, accepted:0},
  {name:'shield82', descr:'Щит Паука [10]', comp:['sp_mat17', 1, 'mater21', 1, 'mater14', 2], location:4, possible:0, accepted:0},
  {name:'shield84_1', descr:'Щит Забытых Времен [10]', comp:['sp_mat17', 1, 'mater13', 2, 'mater31', 1], location:4, possible:0, accepted:0},

//  {name:'', descr:'', comp:['mater',0,'mater',0,'mater',0,'mater',0,'mater',0], location:4, possible:0, accepted:0},

  {name:'enhp_6_revamp10', descr:'', comp:[], location:2, possible:0, accepted:0},
  {name:'enhp_6_revamp10_2', descr:'', comp:[], location:2, possible:0, accepted:0},
//  {name:'pot_base_200_bot4', descr:'Снадобье разума', comp:['mater30',1], location:2, possible:0, accepted:0},

  {name:'axe88', descr:'Топор Кровавой Луны', comp:['mater15',8,'mater5',8], location:0, possible:0, accepted:0},
  {name:'mace67', descr:'Булава Кровавой Луны', comp:['mater28',2,'mater5',5], location:0, possible:0, accepted:0},
  {name:'hammer70', descr:'Молот Кровавой Луны', comp:['mater15',9,'mater5',10], location:0, possible:0, accepted:0},
  {name:'armor106', descr:'Броня Кровавой Луны', comp:['mater20',1,'mater5',8], location:0, possible:0, accepted:0},
  {name:'knife72', descr:'Кинжал Кровавой Луны', comp:['mater28',1,'mater5',12], location:0, possible:0, accepted:0},
  {name:'sword103', descr:'Меч Кровавой Луны', comp:['mater28',1,'mater5',12], location:0, possible:0, accepted:0},
  {name:'naruchi77', descr:'Перчатки Кровавой Луны', comp:['mater28',1,'mater5',3], location:0, possible:0, accepted:0},
  {name:'helmet80', descr:'Шлем Кровавой Луны', comp:['mater15',5,'mater5',6], location:0, possible:0, accepted:0},
  {name:'shield83', descr:'Щит Кровавой Луны', comp:['mater28',1,'mater5',3], location:0, possible:0, accepted:0},
  {name:'amulet80', descr:'Амулет Кровавой Луны', comp:['mater28',2], location:0, possible:0, accepted:0},
  {name:'ring116', descr:'Кольцо Кровавой Луны', comp:['mater28',1], location:0, possible:0, accepted:0},
  {name:'braslet24', descr:'Браслет Кровавой Луны', comp:['mater28',1,'mater5',3], location:0, possible:0, accepted:0},
  {name:'clip80', descr:'Серьги Кровавой Луны', comp:['mater28',2], location:0, possible:0, accepted:0},
  {name:'boots22', descr:'Ботинки Кровавой Луны', comp:['mater28',1,'mater5',5], location:0, possible:0, accepted:0},
  {name:'belt36', descr:'Пояс Кровавой Луны', comp:['mater28',1,'mater5',4], location:0, possible:0, accepted:0},
//!!!  {name:'leg12', descr:'Поножи Кровавой Луны', comp:['mater28',1,'mater5',5], location:0, possible:0, accepted:0},
  
  {name:'knife71', descr:'Кинжал Паука', comp:['mater30',1,'mater12',12], location:0, possible:0, accepted:0},
  {name:'axe87', descr:'Топор Паука', comp:['mater18',9,'mater12',8], location:0, possible:0, accepted:0},
  {name:'mace66', descr:'Булава Паука', comp:['mater30',2,'mater12',5], location:0, possible:0, accepted:0},
  {name:'boots21', descr:'Сапоги Паука', comp:['mater30',1,'mater12',5], location:0, possible:0, accepted:0},
  {name:'helmet79', descr:'Шлем Паука', comp:['mater18',5,'mater12',6], location:0, possible:0, accepted:0},
  {name:'naruchi76', descr:'Наручи Паука', comp:['mater30',1,'mater12',3], location:0, possible:0, accepted:0},
  {name:'belt35', descr:'Пояс Паука', comp:['mater30',1,'mater12',4], location:0, possible:0, accepted:0},
  {name:'shield82', descr:'Щит Паука', comp:['mater30',1,'mater18',3], location:0, possible:0, accepted:0},
  {name:'clip76', descr:'Серьги Паука', comp:['mater30',2], location:0, possible:0, accepted:0},
  {name:'amulet75', descr:'Амулет Паука', comp:['mater30',2], location:0, possible:0, accepted:0},
  {name:'ring110', descr:'Кольцо Паука', comp:['mater30',1], location:0, possible:0, accepted:0},
  {name:'sword102', descr:'Меч Паука', comp:['mater30',1,'mater12',12], location:0, possible:0, accepted:0},
  {name:'naruchi78', descr:'Перчатки Паука', comp:['mater30',1,'mater12',3], location:0, possible:0, accepted:0},
  {name:'armor105', descr:'Броня Паука', comp:['mater22',1,'mater12',8], location:0, possible:0, accepted:0},
//!!!  {name:'leg13', descr:'Поножи Паука', comp:['mater30',1,'mater12',5], location:0, possible:0, accepted:0},

  {name:'axe89', descr:'Топор Забытых Времен', comp:['mater19',9,'mater6',8], location:0, possible:0, accepted:0},
  {name:'clip81', descr:'Серьги Забытых Времен', comp:['mater25',2], location:0, possible:0, accepted:0},
  {name:'amulet81', descr:'Амулет Забытых Времен', comp:['mater25',2], location:0, possible:0, accepted:0},
  {name:'ring117', descr:'Кольцо Забытых Времен', comp:['mater25',1], location:0, possible:0, accepted:0},
  {name:'knife73', descr:'Кинжал Забытых Времен', comp:['mater25',1,'mater6',12], location:0, possible:0, accepted:0},
  {name:'boots23', descr:'Сапоги Забытых Времен', comp:['mater25',1,'mater6',5], location:0, possible:0, accepted:0},
  {name:'naruchi79', descr:'Перчатки Забытых Времен', comp:['mater25',1,'mater6',3], location:0, possible:0, accepted:0},
  {name:'braslet25', descr:'Наручи Забытых Времен', comp:['mater25',1,'mater6',3], location:0, possible:0, accepted:0},
  {name:'belt37', descr:'Пояс Забытых Времен', comp:['mater25',1,'mater6',4], location:0, possible:0, accepted:0},
  {name:'helmet81', descr:'Шлем Забытых Времен', comp:['mater19',5,'mater6',6], location:0, possible:0, accepted:0},
  {name:'mace68', descr:'Булава Забытых Времен', comp:['mater25',2,'mater6',5], location:0, possible:0, accepted:0},
  {name:'hammer71', descr:'Молот Забытых Времен', comp:['mater19',9,'mater6',10], location:0, possible:0, accepted:0},
  {name:'sword104', descr:'Меч Забытых Времен', comp:['mater25',1,'mater6',12], location:0, possible:0, accepted:0},
  {name:'armor107', descr:'Броня Забытых Времен', comp:['mater31',1,'mater6',8], location:0, possible:0, accepted:0},
  {name:'shield84', descr:'Щит Забытых Времен', comp:['mater25',1,'mater19',3], location:0, possible:0, accepted:0},
//!!!  {name:'leg11', descr:'Поножи Забытых Времен', comp:['mater25',1,'mater6',5], location:0, possible:0, accepted:0},

  {name:'ring129', descr:'Кольцо Скорпиона', comp:['mater30',1], location:0, possible:0, accepted:0},
  {name:'axe90', descr:'Топор Скорпиона', comp:['mater16',9,'mater3',8], location:0, possible:0, accepted:0},
  {name:'hammer74', descr:'Цеп Скорпиона', comp:['mater30',2,'mater3',5], location:0, possible:0, accepted:0},
  {name:'knife77', descr:'Клинок Скорпиона', comp:['mater30',1,'mater3',12], location:0, possible:0, accepted:0},
  {name:'sword105', descr:'Меч Скорпиона', comp:['mater30',1,'mater3',12], location:0, possible:0, accepted:0},
  {name:'boots27', descr:'Ботинки Скорпиона', comp:['mater30',1,'mater3',5], location:0, possible:0, accepted:0},
  {name:'naruchi86', descr:'Перчатки Скорпиона', comp:['mater30',1,'mater3',3], location:0, possible:0, accepted:0},
  {name:'armor109', descr:'Броня Скорпиона', comp:['mater22',1,'mater3',8], location:0, possible:0, accepted:0},
  {name:'helmet85', descr:'Шлем Скорпиона', comp:['mater16',5,'mater3',6], location:0, possible:0, accepted:0},
  {name:'braslet32', descr:'Браслет Скорпиона', comp:['mater30',1,'mater3',3], location:0, possible:0, accepted:0},
  {name:'belt44', descr:'Пояс Скорпиона', comp:['mater30',1,'mater3',4], location:0, possible:0, accepted:0},
  {name:'shield86', descr:'Щит Скорпиона', comp:['mater30',1,'mater16',3], location:0, possible:0, accepted:0},
  {name:'clip90', descr:'Серьги Скорпиона', comp:['mater30',2], location:0, possible:0, accepted:0},
  {name:'amulet98', descr:'Амулет Скорпиона', comp:['mater30',2], location:0, possible:0, accepted:0},
//!!!  {name:'leg16', descr:'Поножи Скорпиона', comp:['mater30',1,'mater3',5], location:0, possible:0, accepted:0},

  {name:'ring128', descr:'Кольцо Злодеяний', comp:['mater29',1], location:0, possible:0, accepted:0},
  {name:'knife76', descr:'Кинжал Злодеяний', comp:['mater29',1,'mater10',12], location:0, possible:0, accepted:0},
  {name:'sword100', descr:'Меч Злодеяний', comp:['mater14',8,'mater10',9], location:0, possible:0, accepted:0},
  {name:'boots26', descr:'Ботинки Злодеяний', comp:['mater29',1,'mater10',5], location:0, possible:0, accepted:0},
  {name:'naruchi85', descr:'Перчатки Злодеяний', comp:['mater29',1,'mater10',3], location:0, possible:0, accepted:0},
  {name:'armor108', descr:'Броня Злодеяний', comp:['mater21',1,'mater10',8], location:0, possible:0, accepted:0},
  {name:'helmet84', descr:'Шлем Злодеяний', comp:['mater14',5,'mater10',6], location:0, possible:0, accepted:0},
  {name:'braslet31', descr:'Наручи Злодеяний', comp:['mater29',1,'mater10',3], location:0, possible:0, accepted:0},
  {name:'belt43', descr:'Пояс Злодеяний', comp:['mater29',1,'mater10',4], location:0, possible:0, accepted:0},
  {name:'shield85', descr:'Щит Злодеяний', comp:['mater29',1,'mater14',3], location:0, possible:0, accepted:0},
  {name:'clip89', descr:'Серьги Злодеяний', comp:['mater29',2], location:0, possible:0, accepted:0},
  {name:'amulet97', descr:'Амулет Злодеяний', comp:['mater29',2], location:0, possible:0, accepted:0},
//!!!  {name:'leg17', descr:'Поножи Злодеяний', comp:['mater29',1,'mater10',5], location:0, possible:0, accepted:0},

  {name:'knife74_du2', descr:'Кинжал Утреннего Солнца', comp:['mater27',1,'mater2',11,'mater2',1], location:0, possible:0, accepted:0},
  {name:'axe90_du2', descr:'Топор Утреннего Солнца', comp:['mater16',9,'mater2',8], location:0, possible:0, accepted:0},
  {name:'hammer72_du2', descr:'Молот Утреннего Солнца', comp:['mater27',2,'mater2',5], location:0, possible:0, accepted:0},
  {name:'sword105_du2', descr:'Меч Утреннего Солнца', comp:['mater27',1,'mater2',11,'mater2',1], location:0, possible:0, accepted:0},
  {name:'boots24_du2', descr:'Сапоги Утреннего Солнца', comp:['mater27',1,'mater2',5], location:0, possible:0, accepted:0},
  {name:'naruchi83_du2', descr:'Перчатки Утреннего Солнца', comp:['mater27',1,'mater2',3], location:0, possible:0, accepted:0},
  {name:'armor108_du1', descr:'Броня Утреннего Солнца', comp:['mater23',1,'mater2',8], location:0, possible:0, accepted:0},
  {name:'helmet82_du2', descr:'Шлем Утреннего Солнца', comp:['mater16',5,'mater2',6], location:0, possible:0, accepted:0},
  {name:'braslet26_du2', descr:'Наручи Утреннего Солнца', comp:['mater27',1,'mater2',3], location:0, possible:0, accepted:0},
  {name:'belt38_du2', descr:'Пояс Утреннего Солнца', comp:['mater27',1,'mater2',4], location:0, possible:0, accepted:0},
  {name:'shield85_du2', descr:'Щит Утреннего Солнца', comp:['mater27',1,'mater16',3], location:0, possible:0, accepted:0},
  {name:'clip82_du2', descr:'Серьги Утреннего Солнца', comp:['mater27',2], location:0, possible:0, accepted:0},
  {name:'amulet83_du2', descr:'Ожерелье Утреннего Солнца', comp:['mater27',2], location:0, possible:0, accepted:0},
  {name:'ring119_du2', descr:'Кольцо Утреннего Солнца', comp:['mater27',1], location:0, possible:0, accepted:0},
//!!!  {name:'leg14', descr:'Поножи Утреннего Солнца', comp:['mater27',1,'mater2',5], location:0, possible:0, accepted:0},

  {name:'belt39', descr:'Пояс Решимости', comp:['mater26',1,'mater1',4], location:0, possible:0, accepted:0},
  {name:'roba51', descr:'Мантия Решимости', comp:['mater24',1,'mater1',8], location:0, possible:0, accepted:0},
  {name:'braslet27', descr:'Наручи Решимости', comp:['mater26',1,'mater1',3], location:0, possible:0, accepted:0},
  {name:'helmet83', descr:'Маска Решимости', comp:['mater17',5,'mater1',6], location:0, possible:0, accepted:0},
  {name:'staff52', descr:'Посох Решимости', comp:['mater24',1,'mater17',2], location:0, possible:0, accepted:0},
  {name:'naruchi84', descr:'Перчатки Решимости', comp:['mater26',1,'mater1',6], location:0, possible:0, accepted:0},
  {name:'boots25', descr:'Сапоги Решимости', comp:['mater26',1,'mater1',5], location:0, possible:0, accepted:0},
  {name:'leg15', descr:'Штаны Решимости', comp:['mater26',1,'mater1',5], location:0, possible:0, accepted:0},
*/
  
//  {name:'', descr:'', comp:['mater',0,'mater',0,'mater',0,'mater',0,'mater',0], location:4, possible:0, accepted:0},

// Йолки ;)
  { name:'el1', descr:'Йолка', comp: ['elka_vetv1',4,'shar3_2005',3,'shar5_2005',3,'shar2_2005',2,'ny06ball1',2,'ny06ball9',2,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'el2', descr:'Йолка', comp: ['shar1_2005',6,'shar5_2005',3,'elka_vetv2',2,'elka_vetv1',2,'shar2_2005',2,'ny06ball6',1,'ny06ball7',1,'elka_base1',1,'ny06ball5',1,'ny06ball11',1], location:5, possible:0, accepted:0},
  { name:'nel3', descr:'Йолка', comp: ['shar3_2005',3,'elka_vetv2',3,'shar5_2005',2,'shar2_2005',2,'shar1_2005',2,'svechka3',1,'elka_vetv1',1,'shar6_2005',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'nel1', descr:'Йолка', comp: ['shar5_2005',4,'shar2_2005',4,'elka_vetv2',3,'ny06ball6',1,'elka_vetv1',1,'ny06ball9',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'gnel2', descr:'Йолка', comp: ['elka_vetv2',3,'shar2_2005',3,'shar5_2005',2,'bengal1',1,'elka_vetv1',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'gnel1', descr:'Йолка', comp: ['elka_vetv2',2,'shar5_2005',2,'elka_vetv1',2,'bengal1',1,'svechka1',1,'ny06ball3',1,'shar1_2005',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'gnel3', descr:'Йолка', comp: ['shar4_2005',6,'shar2_2005',5,'elka_vetv1',3,'shar3_2005',1,'elka_vetv2',1,'shar5_2005',1,'ny06ball3',1,'ny06ball9',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w8', descr:'Йолка', comp: ['shar4_2005',4,'elka_vetv1',3,'elka_vetv2',1,'shar5_2005',1,'bengal1',1,'ny06ball5',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w9', descr:'Йолка', comp: ['shar4_2005',3,'shar3_2005',2,'elka_vetv2',2,'elka_vetv1',2,'shar7_2005',1,'ny06ball4',1,'ny06ball10',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w2', descr:'Йолка', comp: ['shar5_2005',4,'elka_vetv2',3,'shar2_2005',3,'shar1_2005',3,'shar3_2005',1,'bengal1',1,'svechka1',1,'elka_vetv1',1,'ny06ball1',1,'ny06ball5',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w7', descr:'Йолка', comp: ['shar4_2005',4,'elka_vetv2',3,'shar5_2005',2,'shar2_2005',1,'ny06ball10',1,'elka_vetv1',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w3', descr:'Йолка', comp: ['shar2_2005',7,'elka_vetv1',4,'shar3_2005',3,'shar4_2005',1,'shar7_2005',1,'ny06ball3',1,'elka_base1',1,'ny06ball12',1], location:5, possible:0, accepted:0},
  { name:'elka_w5', descr:'Йолка', comp: ['shar3_2005',4,'elka_vetv2',3,'shar4_2005',2,'shar2_2005',2,'elka_vetv1',1,'ny06ball1',1,'ny06ball3',1,'elka_base1',1,'ny06ball8',1], location:5, possible:0, accepted:0},
  { name:'elka_w4', descr:'Йолка', comp: ['shar1_2005',4,'shar4_2005',3,'elka_vetv2',2,'elka_vetv1',2,'shar3_2005',1,'ny06ball6',1,'svechka1',1,'elka_base1',1,'shar8_2005',1], location:5, possible:0, accepted:0},
  { name:'elka_w6', descr:'Йолка', comp: ['elka_vetv1',4,'shar4_2005',2,'shar3_2005',2,'shar5_2005',2,'shar1_2005',2,'ny06ball4',1,'ny06ball5',1,'elka_base1',1,'ny06ball8',1,'ny06ball11',1], location:5, possible:0, accepted:0},
  { name:'elka_w1', descr:'Йолка', comp: ['elka_vetv2',3,'shar3_2005',2,'shar4_2005',1,'ny06ball7',1,'elka_vetv1',1,'ny06ball1',1,'ny06ball5',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w15', descr:'Йолка', comp: ['elka_vetv2',3,'shar5_2005',3,'shar3_2005',2,'shar2_2005',1,'ny06ball10',1,'elka_vetv1',1,'ny06ball3',1,'shar1_2005',1,'elka_base1',1,'ny06ball8',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w17', descr:'Йолка', comp: ['shar3_2005',3,'shar1_2005',3,'elka_vetv2',2,'elka_vetv1',2,'shar4_2005',1,'shar5_2005',1,'svechka2',1,'ny06ball3',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w12', descr:'Йолка', comp: ['elka_vetv1',4,'shar4_2005',2,'shar1_2005',2,'ny06ball6',1,'elka_base1',1,'shar8_2005',1], location:5, possible:0, accepted:0},
  { name:'elka_w13', descr:'Йолка', comp: ['elka_vetv1',4,'shar5_2005',3,'shar1_2005',3,'shar3_2005',2,'shar2_2005',2,'shar4_2005',1,'bengal1',1,'svechka1',1,'ny06ball1',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w14', descr:'Йолка', comp: ['shar1_2005',4,'elka_vetv2',3,'shar2_2005',2,'shar4_2005',1,'ny06ball6',1,'shar5_2005',1,'bengal1',1,'elka_vetv1',1,'ny06ball5',1,'elka_base1',1,'ny06ball12',1], location:5, possible:0, accepted:0},
  { name:'elka_w16', descr:'Йолка', comp: ['elka_vetv2',3,'shar3_2005',2,'shar2_2005',2,'shar4_2005',1,'svechka3',1,'shar5_2005',1,'ny06ball4',1,'svechka1',1,'elka_vetv1',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w26', descr:'Йолка', comp: ['elka_vetv2',3,'shar5_2005',2,'shar1_2005',2,'shar4_2005',1,'ny06ball10',1,'elka_vetv1',1,'ny06ball5',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w27', descr:'Йолка', comp: ['elka_vetv1',3,'shar3_2005',2,'shar4_2005',2,'shar5_2005',2,'elka_vetv2',1,'svechka2',1,'ny06ball9',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w24', descr:'Йолка', comp: ['elka_vetv1',4,'shar2_2005',3,'shar4_2005',2,'ny06ball7',1,'svechka1',1,'elka_base1',1,'ny06ball2',1], location:5, possible:0, accepted:0},
  { name:'elka_w25', descr:'Йолка', comp: ['shar4_2005',3,'elka_vetv2',3,'shar5_2005',2,'shar2_2005',2,'shar3_2005',1,'elka_vetv1',1,'ny06ball1',1,'ny06ball5',1,'elka_base1',1,'ny06ball8',1], location:5, possible:0, accepted:0},
  { name:'elka_w23', descr:'Йолка', comp: ['shar2_2005',5,'shar3_2005',4,'elka_vetv1',3,'shar1_2005',2,'shar4_2005',1,'elka_vetv2',1,'ny06ball3',1,'elka_base1',1,'ny06ball8',1], location:5, possible:0, accepted:0},
  { name:'elka_w21', descr:'Йолка', comp: ['elka_vetv1',3,'shar3_2005',1,'shar4_2005',1,'elka_vetv2',1,'shar5_2005',1,'ny06ball4',1,'shar2_2005',1,'svechka1',1,'shar1_2005',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w20', descr:'Йолка', comp: ['shar4_2005',4,'elka_vetv1',3,'elka_vetv2',1,'shar2_2005',1,'ny06ball10',1,'elka_base1',1,'ny06ball2',1,'shar8_2005',1], location:5, possible:0, accepted:0},
  { name:'elka_w22', descr:'Йолка', comp: ['shar2_2005',4,'elka_vetv2',3,'shar4_2005',2,'ny06ball5',2,'shar5_2005',1,'elka_vetv1',1,'elka_base1',1,'shar8_2005',1], location:5, possible:0, accepted:0},
  { name:'elka_w29', descr:'Йолка', comp: ['elka_vetv2',3,'shar2_2005',3,'shar5_2005',2,'shar3_2005',1,'svechka3',1,'svechka2',1,'ny06ball4',1,'elka_vetv1',1,'shar1_2005',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w28', descr:'Йолка', comp: ['shar2_2005',3,'elka_vetv2',2,'elka_vetv1',2,'shar3_2005',1,'ny06ball7',1,'svechka2',1,'ny06ball3',1,'elka_base1',1], location:5, possible:0, accepted:0},
  { name:'elka_w19', descr:'Йолка', comp: ['shar3_2005',3,'shar4_2005',3,'elka_vetv2',2,'shar5_2005',2,'elka_vetv1',2,'shar2_2005',1,'ny06ball1',1,'elka_base1',1,'ny06ball12',1,'ny06ball2',1], location:5, possible:0, accepted:0},

// Букеты
  { name:'event_valentine_buket_big', descr:'Букет кровавых подземников', comp: ['event_valentine_reward_small',36,'event_valentine_reward_med',18,'event_valentine_reward_big',11], location:5, possible:0, accepted:0},
  { name:'event_valentine_buket_med', descr:'Букет черепичных подземников', comp: ['event_valentine_reward_small',20,'event_valentine_reward_med',11], location:5, possible:0, accepted:0},
  { name:'event_valentine_buket_small', descr:'Букет блеклых подземников', comp: ['event_valentine_reward_small',11], location:5, possible:0, accepted:0}
  
// Разное
/*
  { name:'dispell1', descr:'Снять Проклятье', comp: ['mater294',1,'mater298',5], location:6, possible:0, accepted:0 },
  { name:'naruchi41', descr:'Наручи Неотвратимого Возмездия', comp:['mater300',5, 'mater299',3, 'mater296',6, 'mater298',7, 'mater295',8], location:6, possible:0, accepted:0 }
*/
];

