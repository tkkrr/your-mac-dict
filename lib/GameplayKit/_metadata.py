# This file is generated by objective.metadata
#
# Last update: Sun Sep 30 22:14:19 2018

import objc, sys

if sys.maxsize > 2 ** 32:

    def sel32or64(a, b):
        return b


else:

    def sel32or64(a, b):
        return a


if sys.byteorder == "little":

    def littleOrBig(a, b):
        return a


else:

    def littleOrBig(a, b):
        return b


misc = {}
misc.update(
    {
        "GKBox": objc.createStructType("GKBox", b"{GKBox=}", ["boxMin", "boxMax"]),
        "GKQuad": objc.createStructType("GKQuad", b"{GKQuad=}", ["quadMin", "quadMax"]),
    }
)
constants = """$$"""
enums = """$GKGameModelMaxScore@16777216$GKGameModelMinScore@-16777216$GKMeshGraphTriangulationModeCenters@2$GKMeshGraphTriangulationModeEdgeMidpoints@4$GKMeshGraphTriangulationModeVertices@1$GKRTreeSplitStrategyHalve@0$GKRTreeSplitStrategyLinear@1$GKRTreeSplitStrategyQuadratic@2$GKRTreeSplitStrategyReduceOverlap@3$GK_VERSION@80000000$"""
misc.update({})
aliases = {"GK_AVAILABLE": "__OSX_AVAILABLE_STARTING"}
r = objc.registerMetaDataForSelector
objc._updatingMetadata(True)
try:
    r(b"GKAgent3D", b"rightHanded", {"retval": {"type": b"Z"}})
    r(b"GKAgent3D", b"rotation", {"retval": {"type": b"{_matrix_float3x3=?}"}})
    r(b"GKAgent3D", b"setRightHanded:", {"arguments": {2: {"type": b"Z"}}})
    r(
        b"GKAgent3D",
        b"setRotation:",
        {"arguments": {2: {"type": b"{_matrix_float3x3=?}"}}},
    )
    r(b"GKDecisionTree", b"exportToURL:error:", {"retval": {"type": b"Z"}})
    r(
        b"GKGoal",
        b"goalToFollowPath:maxPredictionTime:forward:",
        {"arguments": {4: {"type": b"Z"}}},
    )
    r(
        b"GKGraph",
        b"connectNodeToLowestCostNode:bidirectional:",
        {"arguments": {3: {"type": b"Z"}}},
    )
    r(
        b"GKGraphNode",
        b"addConnectionsToNodes:bidirectional:",
        {"arguments": {3: {"type": b"Z"}}},
    )
    r(
        b"GKGraphNode",
        b"removeConnectionsToNodes:bidirectional:",
        {"arguments": {3: {"type": b"Z"}}},
    )
    r(b"GKGridGraph", b"diagonalsAllowed", {"retval": {"type": b"Z"}})
    r(
        b"GKGridGraph",
        b"graphFromGridStartingAt:width:height:diagonalsAllowed:",
        {"arguments": {5: {"type": b"Z"}}},
    )
    r(
        b"GKGridGraph",
        b"graphFromGridStartingAt:width:height:diagonalsAllowed:nodeClass:",
        {"arguments": {5: {"type": b"Z"}}},
    )
    r(
        b"GKGridGraph",
        b"initFromGridStartingAt:width:height:diagonalsAllowed:",
        {"arguments": {5: {"type": b"Z"}}},
    )
    r(
        b"GKGridGraph",
        b"initFromGridStartingAt:width:height:diagonalsAllowed:nodeClass:",
        {"arguments": {5: {"type": b"Z"}}},
    )
    r(b"GKNSPredicateRule", b"evaluatePredicateWithSystem:", {"retval": {"type": b"Z"}})
    r(
        b"GKNoise",
        b"remapValuesToTerracesWithPeaks:terracesInverted:",
        {"arguments": {3: {"type": b"Z"}}},
    )
    r(
        b"GKNoiseMap",
        b"initWithNoise:size:origin:sampleCount:seamless:",
        {"arguments": {6: {"type": b"Z"}}},
    )
    r(b"GKNoiseMap", b"isSeamless", {"retval": {"type": b"Z"}})
    r(
        b"GKNoiseMap",
        b"noiseMapWithNoise:size:origin:sampleCount:seamless:",
        {"arguments": {6: {"type": b"Z"}}},
    )
    r(
        b"GKObstacleGraph",
        b"isConnectionLockedFromNode:toNode:",
        {"retval": {"type": b"Z"}},
    )
    r(b"GKOctree", b"removeElement:", {"retval": {"type": b"Z"}})
    r(b"GKOctree", b"removeElement:withNode:", {"retval": {"type": b"Z"}})
    r(
        b"GKPath",
        b"initWithFloat3Points:count:radius:cyclical:",
        {"arguments": {2: {"type": "n", "arg_size_in_arg": 1}, 5: {"type": b"Z"}}},
    )
    r(
        b"GKPath",
        b"initWithPoints:count:radius:cyclical:",
        {"arguments": {2: {"type": "n", "arg_size_in_arg": 1}, 5: {"type": b"Z"}}},
    )
    r(b"GKPath", b"isCyclical", {"retval": {"type": b"Z"}})
    r(
        b"GKPath",
        b"pathWithFloat3Points:count:radius:cyclical:",
        {"arguments": {2: {"type": "n", "arg_size_in_arg": 1}, 5: {"type": b"Z"}}},
    )
    r(
        b"GKPath",
        b"pathWithPoints:count:radius:cyclical:",
        {"arguments": {2: {"type": "n", "arg_size_in_arg": 1}, 5: {"type": b"Z"}}},
    )
    r(b"GKPath", b"pointAtIndex:", {"deprecated": 1012})
    r(b"GKPath", b"setCyclical:", {"arguments": {2: {"type": b"Z"}}})
    r(
        b"GKPolygonObstacle",
        b"initWithPoints:count:",
        {"arguments": {2: {"type": "n", "arg_size_in_arg": 1}}},
    )
    r(
        b"GKPolygonObstacle",
        b"obstacleWithPoints:count:",
        {"arguments": {2: {"type": "n", "arg_size_in_arg": 1}}},
    )
    r(b"GKQuadtree", b"removeElement:", {"retval": {"type": b"Z"}})
    r(b"GKQuadtree", b"removeElement:withNode:", {"retval": {"type": b"Z"}})
    r(b"GKRandomDistribution", b"nextBool", {"retval": {"type": b"Z"}})
    r(b"GKRule", b"evaluatePredicateWithSystem:", {"retval": {"type": b"Z"}})
    r(
        b"GKRule",
        b"ruleWithBlockPredicate:action:",
        {
            "arguments": {
                2: {
                    "callable": {
                        "retval": {"type": b"Z"},
                        "arguments": {0: {"type": b"^v"}, 1: {"type": b"@"}},
                    }
                },
                3: {
                    "callable": {
                        "retval": {"type": b"v"},
                        "arguments": {0: {"type": b"^v"}, 1: {"type": b"@"}},
                    }
                },
            }
        },
    )
    r(b"GKState", b"isValidNextState:", {"retval": {"type": b"Z"}})
    r(b"GKStateMachine", b"canEnterState:", {"retval": {"type": b"Z"}})
    r(b"GKStateMachine", b"enterState:", {"retval": {"type": b"Z"}})
    r(
        b"GKVoronoiNoiseSource",
        b"initWithFrequency:displacement:distanceEnabled:seed:",
        {"arguments": {4: {"type": b"Z"}}},
    )
    r(b"GKVoronoiNoiseSource", b"isDistanceEnabled", {"retval": {"type": b"Z"}})
    r(b"GKVoronoiNoiseSource", b"setDistanceEnabled:", {"arguments": {2: {"type": b"Z"}}})
    r(
        b"GKVoronoiNoiseSource",
        b"voronoiNoiseWithFrequency:displacement:distanceEnabled:seed:",
        {"arguments": {4: {"type": b"Z"}}},
    )
    r(b"NSObject", b"activePlayer", {"required": True, "retval": {"type": b"@"}})
    r(
        b"NSObject",
        b"agentDidUpdate:",
        {"required": False, "retval": {"type": b"v"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"agentWillUpdate:",
        {"required": False, "retval": {"type": b"v"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"applyGameModelUpdate:",
        {"required": True, "retval": {"type": b"v"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"bestMoveForActivePlayer",
        {"required": True, "retval": {"type": b"@"}},
    )
    r(b"NSObject", b"gameModel", {"required": True, "retval": {"type": b"@"}})
    r(
        b"NSObject",
        b"gameModelUpdatesForPlayer:",
        {"required": True, "retval": {"type": b"@"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"isLossForPlayer:",
        {"required": False, "retval": {"type": b"Z"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"isWinForPlayer:",
        {"required": False, "retval": {"type": b"Z"}, "arguments": {2: {"type": b"@"}}},
    )
    r(b"NSObject", b"nextBool", {"required": True, "retval": {"type": b"Z"}})
    r(b"NSObject", b"nextInt", {"required": True, "retval": {"type": b"q"}})
    r(
        b"NSObject",
        b"nextIntWithUpperBound:",
        {"required": True, "retval": {"type": b"Q"}, "arguments": {2: {"type": b"Q"}}},
    )
    r(b"NSObject", b"nextUniform", {"required": True, "retval": {"type": b"f"}})
    r(
        b"NSObject",
        b"playerId",
        {"required": True, "retval": {"type": sel32or64(b"i", b"q")}},
    )
    r(b"NSObject", b"players", {"required": True, "retval": {"type": b"@"}})
    r(b"NSObject", b"randomSource", {"required": True, "retval": {"type": b"@"}})
    r(
        b"NSObject",
        b"scoreForPlayer:",
        {"required": False, "retval": {"type": b"q"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"setGameModel:",
        {"required": True, "retval": {"type": b"v"}, "arguments": {2: {"type": b"@"}}},
    )
    r(b"NSObject", b"setPlayerId:", {"arguments": {2: {"type": sel32or64(b"i", b"q")}}})
    r(
        b"NSObject",
        b"setRandomSource:",
        {"required": True, "retval": {"type": b"v"}, "arguments": {2: {"type": b"@"}}},
    )
    r(
        b"NSObject",
        b"setValue:",
        {"required": True, "retval": {"type": b"v"}, "arguments": {2: {"type": b"q"}}},
    )
    r(
        b"NSObject",
        b"unapplyGameModelUpdate:",
        {"required": False, "retval": {"type": b"v"}, "arguments": {2: {"type": b"@"}}},
    )
    r(b"NSObject", b"value", {"required": True, "retval": {"type": b"q"}})
finally:
    objc._updatingMetadata(False)
expressions = {}

# END OF FILE
