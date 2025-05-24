import type { FeatureCollection, LineString } from 'geojson';

export interface Scenario {
  gps: FeatureCollection<LineString>;
  id: string;
  roads: FeatureCollection<LineString>;
}

export const gpsWalkData: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.646_077_394_005_715, 50.794_510_981_765_6],
          [-3.645_902_241_256_692_4, 50.794_502_354_647_39],
          [-3.645_861_296_459_003, 50.794_469_284_013_39],
          [-3.645_818_076_949_467_5, 50.794_362_882_683_004],
          [-3.645_736_187_352_184_7, 50.794_374_385_541_6]
        ],
        type: 'LineString'
      },
      properties: {
        type: 'route'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const scenarioOneData: FeatureCollection<LineString> = {
  features: [
    {
      bbox: [-3.646_106_7, 50.794_328, -3.645_706_7, 50.794_575_7],
      geometry: {
        coordinates: [
          [-3.646_106_7, 50.794_575_7],
          [-3.645_706_7, 50.794_327]
        ],
        type: 'LineString'
      },
      id: '71',
      properties: {
        hash: 'gcj2vnbgz.gcj2vnc62',
        highway: 'footway',
        length: 39.358_070_231_087_16,
        name: null,
        oneway: false,
        osmid: 176_300_525,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const gpsWalkAlongSingleLineStringWithVariations: FeatureCollection<LineString> =
  {
    features: [
      {
        geometry: {
          coordinates: [
            [-3.647_047_916_134_624_8, 50.794_765_188_022_61],
            [-3.646_859_570_581_682_4, 50.794_787_767_080_55],
            [-3.646_624_679_861_872_7, 50.794_782_293_370_53],
            [-3.646_541_331_543_005_5, 50.794_762_451_166_35]
          ],
          type: 'LineString'
        },
        properties: {
          type: 'route'
        },
        type: 'Feature'
      }
    ],
    type: 'FeatureCollection'
  };

export const singleLineStringWithVariations: FeatureCollection<LineString> = {
  features: [
    {
      bbox: [-3.647_211_5, 50.794_694, -3.646_380_4, 50.794_801_7],
      geometry: {
        coordinates: [
          [-3.646_380_4, 50.794_694],
          [-3.646_498_8, 50.794_764_5],
          [-3.646_581_2, 50.794_799_2],
          [-3.646_678_9, 50.794_801_7],
          [-3.646_808_9, 50.794_787_4],
          [-3.646_937_6, 50.794_772_8],
          [-3.647_211_5, 50.794_788]
        ],
        type: 'LineString'
      },
      id: '35',
      properties: {
        hash: 'gcj2vnbu9.gcj2vnbjj',
        highway: 'residential',
        length: 63.055_002_948_254_75,
        name: 'Beech Park',
        oneway: false,
        osmid: 29_406_930,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const gpsWalkAlongTwoLineStrings: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.647_923_598_279_59, 50.794_874_299_570_89],
          [-3.647_868_238_595_72, 50.794_821_245_970_525],
          [-3.647_818_236_300_509, 50.794_800_927_554_49],
          [-3.647_530_723_101_624_5, 50.794_811_086_763_84]
        ],
        type: 'LineString'
      },
      properties: {
        type: 'route'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const twoLineStrings: FeatureCollection<LineString> = {
  features: [
    {
      bbox: [-3.647_872_4, 50.794_749_3, -3.647_211_5, 50.794_798_7],
      geometry: {
        coordinates: [
          [-3.647_211_5, 50.794_788],
          [-3.647_515_1, 50.794_798_7],
          [-3.647_685_5, 50.794_787_4],
          [-3.647_872_4, 50.794_749_3]
        ],
        type: 'LineString'
      },
      id: '42',
      properties: {
        hash: 'gcj2vnbjj.gcj2uyzsy',
        highway: 'residential',
        length: 47.217_396_755_816_274,
        name: 'Beech Park',
        oneway: false,
        osmid: 29_406_930,
        reversed: false,
        selected: true,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.648_025, 50.794_749_3, -3.647_872_4, 50.794_913],
      geometry: {
        coordinates: [
          [-3.648_025, 50.794_913],
          [-3.647_933_4, 50.794_851_7],
          [-3.647_872_4, 50.794_749_3]
        ],
        type: 'LineString'
      },
      id: '88',
      properties: {
        hash: 'gcj2uyztf.gcj2uyzsy',
        highway: 'residential',
        length: 21.542_981_725_282_807,
        name: 'Beech Park',
        oneway: false,
        osmid: 176_758_347,
        reversed: false,
        selected: true,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const data: FeatureCollection = {
  features: [
    {
      bbox: [-3.646_106_7, 50.794_575_7, -3.645_764_5, 50.794_762_4],
      geometry: {
        coordinates: [
          [-3.646_106_7, 50.794_575_7],
          [-3.645_804_5, 50.794_762_4],
          [-3.645_764_5, 50.794_737_2]
        ],
        type: 'LineString'
      },
      id: '73',
      properties: {
        hash: 'gcj2vnbgz.gcj2vnchz',
        highway: 'footway',
        length: 33.670_341_119_838_454,
        name: null,
        oneway: false,
        osmid: 176_300_538,
        reversed: true,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_764_5, 50.794_520_8, -3.645_408_4, 50.794_737_2],
      geometry: {
        coordinates: [
          [-3.645_408_4, 50.794_520_8],
          [-3.645_764_5, 50.794_737_2]
        ],
        type: 'LineString'
      },
      id: '76',
      properties: {
        hash: 'gcj2vnc7x.gcj2vnchz',
        highway: 'footway',
        length: 34.719_789_202_371_615,
        name: null,
        oneway: false,
        osmid: 176_300_538,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_706_7, 50.794_328, -3.645_408_4, 50.794_520_8],
      geometry: {
        coordinates: [
          [-3.645_706_7, 50.794_328],
          [-3.645_408_4, 50.794_520_8]
        ],
        type: 'LineString'
      },
      id: '69',
      properties: {
        hash: 'gcj2vnc62.gcj2vnc7x',
        highway: 'footway',
        length: 29.986_722_754_456_99,
        name: null,
        oneway: false,
        osmid: 176_300_531,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.646_106_7, 50.794_328, -3.645_706_7, 50.794_575_7],
      geometry: {
        coordinates: [
          [-3.645_706_7, 50.794_328],
          [-3.646_106_7, 50.794_575_7]
        ],
        type: 'LineString'
      },
      id: '68',
      properties: {
        hash: 'gcj2vnc62.gcj2vnbgz',
        highway: 'footway',
        length: 39.358_070_231_087_16,
        name: null,
        oneway: false,
        osmid: 176_300_525,
        reversed: true,
        selected: true,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.646_106_7, 50.794_328, -3.645_706_7, 50.794_575_7],
      geometry: {
        coordinates: [
          [-3.646_106_7, 50.794_575_7],
          [-3.645_706_7, 50.794_328]
        ],
        type: 'LineString'
      },
      id: '71',
      properties: {
        hash: 'gcj2vnbgz.gcj2vnc62',
        highway: 'footway',
        length: 39.358_070_231_087_16,
        name: null,
        oneway: false,
        osmid: 176_300_525,
        reversed: false,
        selected: true,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_706_7, 50.794_328, -3.645_408_4, 50.794_520_8],
      geometry: {
        coordinates: [
          [-3.645_408_4, 50.794_520_8],
          [-3.645_706_7, 50.794_328]
        ],
        type: 'LineString'
      },
      id: '75',
      properties: {
        hash: 'gcj2vnc7x.gcj2vnc62',
        highway: 'footway',
        length: 29.986_722_754_456_99,
        name: null,
        oneway: false,
        osmid: 176_300_531,
        reversed: true,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_764_5, 50.794_520_8, -3.645_408_4, 50.794_737_2],
      geometry: {
        coordinates: [
          [-3.645_764_5, 50.794_737_2],
          [-3.645_408_4, 50.794_520_8]
        ],
        type: 'LineString'
      },
      id: '83',
      properties: {
        hash: 'gcj2vnchz.gcj2vnc7x',
        highway: 'footway',
        length: 34.719_789_202_371_615,
        name: null,
        oneway: false,
        osmid: 176_300_538,
        reversed: true,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.646_106_7, 50.794_575_7, -3.645_764_5, 50.794_762_4],
      geometry: {
        coordinates: [
          [-3.645_764_5, 50.794_737_2],
          [-3.645_804_5, 50.794_762_4],
          [-3.646_106_7, 50.794_575_7]
        ],
        type: 'LineString'
      },
      id: '84',
      properties: {
        hash: 'gcj2vnchz.gcj2vnbgz',
        highway: 'footway',
        length: 33.670_341_119_838_454,
        name: null,
        oneway: false,
        osmid: 176_300_538,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const gpsWalkSouthToNorth: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.648_553_595_384_937_5, 50.794_546_750_713_955],
          [-3.648_564_405_397_922_3, 50.794_633_412_962_405]
        ],
        type: 'LineString'
      },
      properties: {},
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const gpsWalkThreeRoadJunction: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.648_817_697_269_919_3, 50.794_611_028_238_31],
          [-3.648_590_226_260_682, 50.794_635_795_936_586], // gcj2uyzhn gcj2uyzhnq
          [-3.648_530_354_751_244_4, 50.794_626_789_502_67],
          [-3.648_517_293_727_366, 50.794_520_963_770_68],
          [-3.648_550_539_969_619_4, 50.794_454_916_384_325]
        ],
        type: 'LineString'
      },
      properties: {
        type: 'route'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const threeRoadJunction: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.648_286_4, 50.794_642_6],
          [-3.648_551_6, 50.794_623_1]
        ],
        type: 'LineString'
      },
      id: '45',
      properties: {
        hash: 'gcj2uyzsy.gcj2uyzhn',
        highway: 'residential',
        name: 'Beech Park',
        oneway: false,
        osmid: 29_406_930,
        type: 'edge'
      },
      type: 'Feature'
    },
    {
      bbox: [-3.648_834_9, 50.794_596, -3.648_551_6, 50.794_623_1],
      geometry: {
        coordinates: [
          [-3.648_551_6, 50.794_623_1], // gcj2uyzhn gcj2uyzhns
          [-3.648_697_2, 50.794_603],
          [-3.648_834_9, 50.794_596]
        ],
        type: 'LineString'
      },
      id: '57',
      properties: {
        hash: 'gcj2uyzhn.gcj2uyygz',
        highway: 'residential',
        length: 20.184_678_544_716_178,
        name: 'Beech Park',
        oneway: false,
        osmid: 29_406_930,
        type: 'edge'
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [
          [-3.648_551_6, 50.794_623_1],
          [-3.648_541_7, 50.794_535_5],
          [-3.648_567_1, 50.794_451_4]
        ],
        type: 'LineString'
      },
      id: '59',
      properties: {
        hash: 'gcj2uyzhn.gcj2uyz40',
        highway: 'residential',
        length: 44.124_482_020_728_7,
        name: 'Walnut Drive',
        oneway: false,
        osmid: 29_406_981,
        type: 'edge'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const gpsBoxRoads: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.645_340_245_710_173, 50.794_847_915_476],
          [-3.645_433_173_736_506_7, 50.794_903_391_836_584],
          [-3.645_491_253_753_675_7, 50.794_905_023_493_64],
          [-3.645_708_085_815_215_3, 50.794_780_201_593_34],
          [-3.645_726_155_153_852_2, 50.794_719_830_096_824],
          [-3.645_602_251_117_935_6, 50.794_608_876_873_58],
          [-3.645_442_208_406_223, 50.794_551_768_494_1],
          [-3.645_398_325_726_546_3, 50.794_550_136_825_22],
          [-3.645_265_387_022_419_6, 50.794_605_613_539_26],
          [-3.645_231_829_679_005_4, 50.794_649_668_530_3],
          [-3.645_166_005_660_229_3, 50.794_692_091_815_85],
          [-3.645_159_552_325_168_3, 50.794_732_883_399_945],
          [-3.645_190_528_333_955_6, 50.794_763_069_149_724]
        ],
        type: 'LineString'
      },
      properties: {
        type: 'route'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const boxRoads: FeatureCollection<LineString> = {
  features: [
    {
      bbox: [-3.645_764_5, 50.794_520_8, -3.645_408_4, 50.794_737_2],
      geometry: {
        coordinates: [
          [-3.645_408_4, 50.794_520_8],
          [-3.645_764_5, 50.794_737_2]
        ],
        type: 'LineString'
      },
      id: '76',
      properties: {
        hash: 'gcj2vnc7x.gcj2vnchz',
        highway: 'footway',
        length: 34.719_789_202_371_615,
        name: null,
        oneway: false,
        osmid: 176_300_538,
        type: 'edge'
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_408_4, 50.794_520_8, -3.645_096_9, 50.794_713_5],
      geometry: {
        coordinates: [
          [-3.645_408_4, 50.794_520_8],
          [-3.645_096_9, 50.794_713_5]
        ],
        type: 'LineString'
      },
      id: '74',
      properties: {
        hash: 'gcj2vnc7x.gcj2vncsx',
        highway: 'footway',
        length: 30.634_764_899_601_49,
        name: null,
        oneway: false,
        osmid: 176_300_531,
        type: 'edge'
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_764_5, 50.794_737_2, -3.645_450_7, 50.794_934_2],
      geometry: {
        coordinates: [
          [-3.645_450_7, 50.794_934_2],
          [-3.645_764_5, 50.794_737_2]
        ],
        type: 'LineString'
      },
      id: '85',
      properties: {
        hash: 'gcj2vncmy.gcj2vnchz',
        highway: 'footway',
        length: 31.085_499_751_293_852,
        name: null,
        oneway: false,
        osmid: 176_300_518,
        type: 'edge'
      },
      type: 'Feature'
    },
    {
      bbox: [-3.645_450_7, 50.794_713_5, -3.645_096_9, 50.794_934_2],
      geometry: {
        coordinates: [
          [-3.645_450_7, 50.794_934_2],
          [-3.645_096_9, 50.794_713_5]
        ],
        type: 'LineString'
      },
      id: '86',
      properties: {
        hash: 'gcj2vncmy.gcj2vncsx',
        highway: 'footway',
        length: 34.937_537_688_013_52,
        name: null,
        oneway: false,
        osmid: 176_300_530,
        type: 'edge'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const separateRoads: FeatureCollection<LineString> = {
  features: [
    {
      bbox: [-3.647_197_9, 50.794_112, -3.646_380_4, 50.794_694],
      geometry: {
        coordinates: [
          [-3.647_197_9, 50.794_112],
          [-3.646_977, 50.794_252_8],
          [-3.646_741_6, 50.794_432_7],
          [-3.646_380_4, 50.794_694]
        ],
        type: 'LineString'
      },
      id: '40',
      properties: {
        hash: 'gcj2vnb1n.gcj2vnbu9',
        highway: 'unclassified',
        length: 86.593_763_448_132_99,
        name: 'Old Tiverton Road',
        oneway: false,
        osmid: 29_355_558,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    },
    {
      bbox: [-3.646_513_7, 50.794_420_6, -3.646_106_7, 50.794_575_7],
      geometry: {
        coordinates: [
          [-3.646_106_7, 50.794_575_7],
          [-3.646_358, 50.794_420_6],
          [-3.646_513_7, 50.794_517_7]
        ],
        type: 'LineString'
      },
      id: '72',
      properties: {
        hash: 'gcj2vnbgz.gcj2vnbew',
        highway: 'footway',
        length: 40.059_809_872_466,
        name: null,
        oneway: false,
        osmid: 176_300_538,
        reversed: false,
        selected: false,
        service: null,
        street_count: null,
        type: 'edge',
        x: null,
        y: null
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const gpsSeparateRoads: FeatureCollection<LineString> = {
  features: [
    {
      geometry: {
        coordinates: [
          [-3.646_865_666_648_750_4, 50.794_314_849_512_176],
          [-3.646_758_221_168_426, 50.794_400_078_552_8],
          [-3.646_577_038_593_562_7, 50.794_489_302_537_9],
          [-3.646_499_087_950_445_5, 50.794_482_644_037_49],
          [-3.646_404_283_114_861_8, 50.794_430_707_701_31],
          [-3.646_197_819_250_403_4, 50.794_481_312_337_21]
        ],
        type: 'LineString'
      },
      properties: {
        type: 'route'
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const scenarios: Scenario[] = [
  {
    gps: gpsWalkData,
    id: 'scenario-one',
    roads: scenarioOneData
  },
  {
    gps: gpsWalkAlongSingleLineStringWithVariations,
    id: 'scenario-two',
    roads: singleLineStringWithVariations
  },
  {
    gps: gpsWalkAlongTwoLineStrings,
    id: 'scenario-three',
    roads: twoLineStrings
  },
  {
    gps: gpsWalkThreeRoadJunction,
    // gps: gpsWalkSouthToNorth,
    id: 'scenario-four',
    roads: threeRoadJunction
  },
  {
    gps: gpsBoxRoads,
    id: 'scenario-five',
    roads: boxRoads
  },
  {
    gps: gpsSeparateRoads,
    id: 'scenario-six',
    roads: separateRoads
  }
];

export type ScenarioId =
  | 'scenario-one'
  | 'scenario-two'
  | 'scenario-three'
  | 'scenario-four'
  | 'scenario-five'
  | 'scenario-six';
