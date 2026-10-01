<table align="center" width="100%" cellpadding="8" cellspacing="0">
<tr>
<td valign="top" align="center" width="68%">

# fh1m

**Autonomy systems · robotics · embedded control**

Perception, estimation, and control for machines that operate outside the screen.

[![Portfolio](https://img.shields.io/badge/PORTFOLIO-ffffff?style=for-the-badge&labelColor=90caf9&logo=googlechrome&logoColor=000000)](https://fh1m.github.io/)
[![Work index](https://img.shields.io/badge/WORK_INDEX-ffffff?style=for-the-badge&labelColor=ff8a80&logo=bookstack&logoColor=000000)](https://fh1m.github.io/work)
[![Mongla](https://img.shields.io/badge/MONGLA-ffffff?style=for-the-badge&labelColor=64b5f6&logo=ros&logoColor=000000)](https://github.com/fh1m/mongla_ws)
[![Repositories](https://img.shields.io/badge/24_REPOSITORIES-ffffff?style=for-the-badge&labelColor=cfd8dc&logo=github&logoColor=000000)](https://github.com/fh1m?tab=repositories)
[![Engineering log](https://img.shields.io/badge/ENGINEERING_LOG-ffffff?style=for-the-badge&labelColor=ef9a9a&logo=readthedocs&logoColor=000000)](https://fh1m.github.io/log)
[![Current focus](https://img.shields.io/badge/CURRENT_FOCUS-ffffff?style=for-the-badge&labelColor=42a5f5&logo=target&logoColor=000000)](https://fh1m.github.io/now)

<sub>Portfolio = context · Work index = breadth · Mongla = deepest current system · Repositories = source · Log = chronology · Now = active direction</sub>

<table align="center" cellpadding="4" cellspacing="0">
<tr>
<td align="center"><b>SENSE</b><br><sub>camera · IMU · depth</sub></td>
<td align="center">→</td>
<td align="center"><b>ESTIMATE</b><br><sub>EKF · optical flow</sub></td>
<td align="center">→</td>
<td align="center"><b>CONTROL</b><br><sub>firmware · GNC</sub></td>
<td align="center">→</td>
<td align="center"><b>ACT</b><br><sub>ESC · gimbal · vehicle</sub></td>
</tr>
</table>

</td>
<td valign="top" align="center" width="32%">

<table border="1" cellpadding="6" cellspacing="0">
<tr><td align="center">
<img width="220" src="assets/duburi-workstation.png" alt="fh1m working at the BRAC University Duburi workstation">
<br>
<sub><i>One of my favourite—and now last—views from the Duburi lab desk. I will not return to this desk; that is life. The work remains in the systems built there.</i></sub>
</td></tr>
</table>

</td>
</tr>
</table>

## The record

<sub>A compact view of the public engineering surface.</sub>

<div align="center">

| **PUBLIC WORK** | **ACTIVE PERIOD** | **CONTROL** | **VISION** | **TESTED STACK** |
|:---:|:---:|:---:|:---:|:---:|
| `24 repos` | `2023 → now` | `500 Hz` | `53.9 Hz` | `4,208 tests` |

</div>

<div align="center">

[![SYSTEM MAP](https://img.shields.io/badge/SYSTEM_MAP-1976d2?style=for-the-badge&logo=mermaid&logoColor=ffffff)](#the-record)
[![MEASURED SIGNALS](https://img.shields.io/badge/MEASURED_SIGNALS-e53935?style=for-the-badge&logo=googleanalytics&logoColor=ffffff)](#measured-work)
[![SOURCE](https://img.shields.io/badge/SOURCE-37474f?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/fh1m/mongla_ws)

</div>

```mermaid
flowchart LR
    S["sense<br/>camera · IMU · depth"] --> P["perceive<br/>vision · ML"]
    P --> E["estimate<br/>EKF · optical flow"]
    E --> C["control<br/>firmware · GNC"]
    C --> A["act<br/>ESC · gimbal · vehicle"]
    A -. feedback .-> S

    subgraph PH["engineering philosophy"]
        M["measure before claim"] --> H["hold uncertainty honestly"] --> L["let hardware have the final vote"]
    end

    E -. "discipline" .-> M
    A -. "reality check" .-> L
```

The recurring problem is not “which framework?” It is whether the measurement arrives in time, the estimate is honest, and the actuator does what the model asked.

## Engineering trajectory

<sub>From first-principles software to integrated vehicle autonomy.</sub>

| system surface | engineering signal | inspect |
| --- | --- | --- |
| **Foundations** | Python, C, first-principles ML, developer tooling | [Scripts](https://github.com/fh1m/Scripts) · [PDE](https://github.com/fh1m/PDE) · [ML](https://github.com/fh1m/Linear-Regression) |
| **Vehicle systems** | underwater robotics, simulation, embedded sensing, mission software | [Duburi](https://github.com/fh1m/Duburi) · [simulator](https://github.com/fh1m/duburi-sim_ws) · [vision](https://github.com/fh1m/Arduino-Vision) |
| **Edge perception** | on-device vision, prediction, image processing, compact protocols | [Dristy](https://github.com/fh1m/Dristy) · [tracking](https://github.com/fh1m/Track_and_Predict) · [P2P](https://github.com/fh1m/secure-terminal-p2p-chat) |
| **Integrated autonomy** | ROS 2, MAVLink 2, Hailo-8, EKF, optical flow, board control | [Mongla](https://github.com/fh1m/mongla_ws) · [now](https://fh1m.github.io/now) · [log](https://fh1m.github.io/log) |

<sub>The work index carries the full catalogue; each row here is a change in engineering scope.</sub>

## Measured work

<sub>Numbers are here to define interfaces and limits, not decorate the page.</sub>

| signal | what it says |
| --- | --- |
| **500 Hz** | the reflex loop belongs on the board |
| **53.9 Hz** | edge vision can produce a usable observation |
| **18.0 ms** | photon-to-detection was measured, not guessed |
| **44 bytes** | a movement request can cross the cable without smuggling in actuator logic |
| **4,208 tests** | the stack is larger than its demo |
| **320 × 240 / 25.4 FPS** | Dristy gives a small camera a bounded job |

<div align="center">

[![TRACE THE STACK](https://img.shields.io/badge/TRACE_THE_STACK-1565c0?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/fh1m/mongla_ws)
[![READ THE TESTS](https://img.shields.io/badge/READ_THE_TESTS-e53935?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/fh1m/mongla_ws#testing)
[![SEE THE EDGE PATH](https://img.shields.io/badge/SEE_THE_EDGE_PATH-0d47a1?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/fh1m/Dristy)

</div>

> An ESC can report a perfectly respectable zero with nothing attached. A message count is not proof that a thruster is alive.

## Research, leadership, and field work

<sub>The surrounding work: research, competition systems, and engineering ownership.</sub>

[![RESEARCH](https://img.shields.io/badge/RESEARCH-5e35b1?style=for-the-badge&logo=readthedocs&logoColor=ffffff)](https://fh1m.github.io/about)
[![FIELD LOG](https://img.shields.io/badge/FIELD_LOG-c62828?style=for-the-badge&logo=target&logoColor=ffffff)](https://fh1m.github.io/log)
[![COMPETITION WORK](https://img.shields.io/badge/COMPETITION_WORK-1565c0?style=for-the-badge&logo=trophy&logoColor=ffffff)](https://fh1m.github.io/work)
[![CURRENT DIRECTION](https://img.shields.io/badge/CURRENT_DIRECTION-e53935?style=for-the-badge&logo=compass&logoColor=ffffff)](https://fh1m.github.io/now)

Rockets and UAVs: TVC control, flight computers, trajectory prediction, VSLAM, and GPS-denied navigation.<br>
Rovers: inverse kinematics, edge alignment, OCR, and competition data pipelines.<br>
Research: underwater object detection and recommendation systems.<br>
Leadership: engineering ownership across vision, autonomy integration, reliability, and field execution.

## Technical surface

<sub>The tools are broad; the invariant is the full loop from sensor to actuator.</sub>

**Languages** · Python · C/C++<br>
**Robotics** · ROS 2 · MAVLink 2 · Gazebo · ArduPilot<br>
**Perception** · OpenCV · Hailo-8 · optical flow · EKF<br>
**Embedded** · ESP32 · K210 · board-level control

<div align="center">

[![ROS 2 + AUTONOMY](https://img.shields.io/badge/ROS_2_%2B_AUTONOMY-1565c0?style=for-the-badge&logo=ros&logoColor=ffffff)](https://github.com/fh1m/mongla_ws)
[![EDGE VISION](https://img.shields.io/badge/EDGE_VISION-e53935?style=for-the-badge&logo=opencv&logoColor=ffffff)](https://github.com/fh1m/Dristy)
[![FLIGHT + SIMULATION](https://img.shields.io/badge/FLIGHT_%2B_SIMULATION-0d47a1?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/fh1m/duburi-sim_ws)

</div>

<div align="center">

[![Full record](https://img.shields.io/badge/READ_THE_FULL_RECORD-1565c0?style=for-the-badge&logo=readthedocs&logoColor=ffffff)](https://fh1m.github.io/)
[![About](https://img.shields.io/badge/ABOUT-e53935?style=for-the-badge&logo=personio&logoColor=ffffff)](https://fh1m.github.io/about)
[![Source repositories](https://img.shields.io/badge/SOURCE_REPOSITORIES-36454f?style=for-the-badge&logo=github&logoColor=ffffff)](https://github.com/fh1m?tab=repositories)

<sub>Start with the work index for breadth, Mongla for depth, and the repositories when the claim needs inspection.</sub>

<sub>Dhaka, Bangladesh</sub>

</div>
