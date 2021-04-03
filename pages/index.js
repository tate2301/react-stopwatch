import { Flex, Text } from "@chakra-ui/layout";
import { useRef, useState, useEffect, useReducer } from "react";

const useMachine = (config) => {
  // 1 Contain state and the nextEvent string
  // 2 Should listen for new events
  // 3 Invoke entry callback

  const initialState = {
    current: config.initial,
    nextEvents: Object.keys(config.states[config.initial].on)
  }

  const [machineState, send] = useReducer((state, event) => {
    console.log({state, event})

    const currentNode = config.states[state.current];
    console.log({currentNode})

    const nextState = currentNode.on[event]

    if(!nextState) return state;

    if (nextState) {
      return {
        current: nextState,
        nextEvents: Object.keys(config.states[nextState].on)
      }
    }

  }, initialState)

  useEffect(() => {
    config.states[machineState.current]?.entry?.()
  }, [machineState.current])

  return [machineState, send]
}

export default function Home() {
  const init = {
    i: 0,
    s: 0,
    m: 0,
    h: 0
  }

  const [time, setTime] = useState(init)
  const intervalID = useRef()

  const [timerState, send] = useMachine({
    initial: "idle",
    states: {
      idle: {
        on: {
          START: "running"
        },
        entry: () => {
          clearInterval(intervalID.current)
          setTime(init)
          console.log("Now idle")
        }
      },
      running: {
        on: {
          PAUSE: "paused"
        },
        entry: () => {
          intervalID.current = setInterval(() => {
            setTime(t => {
              const newInt = t.i + 1;
              const newSec = newInt % 60
              const newMin = Math.floor(newInt / 60)
              const newHour = Math.floor(newMin / 60)

              return {
                i: t.i + 1,
                s: newSec,
                m: newMin,
                h: newHour
              }
            })
          }, 1000)
        }
      },
      paused: {
        on: {
          START: "running",
          RESET: "idle"
        },
        entry: () => {
          clearInterval(intervalID.current)
        }
      }
    }
  })

  return (
    <Flex h={"100vh"} flexDirection={"column"} justifyContent={"space-between"} p={8}>
      <Flex justifyContent={"center"}>
        <Text fontWeight="bold" fontSize={"5xl"} textAlign="center">
        {time.h < 10 ? `0${time.h}` : time.h}:
        {time.m < 10 ? `0${time.m}` : time.m}:
        {time.s < 10 ? `0${time.s}` : time.s}
        </Text>
      </Flex>
      <Flex justifyContent={"center"}>
        <Flex spaceX={8}>
          {/*START*/}
          {timerState.nextEvents.includes("START") && <Flex onClick={() => send("START")} backgroundColor="white" justifyContent="center" rounded="full" h={12} w={12} shadow={"lg"} p={3}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </Flex>}
          {/*PAUSE*/}
          {timerState.nextEvents.includes("PAUSE") && <Flex onClick={() => send("PAUSE")} backgroundColor="white" justifyContent="center" rounded="full" h={12} w={12} shadow={"lg"} p={3}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </Flex>}
          {/*RESET*/}
          {timerState.nextEvents.includes("RESET") && <Flex onClick={() => send("RESET")} backgroundColor="white" justifyContent="center" rounded="full" h={12} w={12} shadow={"lg"} p={3}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          </Flex>}
        </Flex>
      </Flex>
    </Flex>
  )
}
