<div align="center">

# fh1m

**Autonomy systems · robotics · embedded control**

Perception, estimation, and control for machines that operate outside the screen.

<table border="1" cellpadding="4" cellspacing="0">
<tr><td align="center">
<img width="230" src="assets/duburi-workstation.png" alt="fh1m working at the BRAC University Duburi workstation">
</td></tr>
</table>

<p align="center">
[![Portfolio](https://img.shields.io/badge/PORTFOLIO-ffffff?style=for-the-badge&labelColor=90caf9&color=90caf9&logo=googlechrome&logoColor=000000)](https://fh1m.github.io/)
&nbsp;&nbsp;
[![Work index](https://img.shields.io/badge/WORK_INDEX-ffffff?style=for-the-badge&labelColor=ff8a80&color=ff8a80&logo=bookstack&logoColor=000000)](https://fh1m.github.io/work)
&nbsp;&nbsp;
[![Mongla](https://img.shields.io/badge/MONGLA-ffffff?style=for-the-badge&labelColor=64b5f6&color=64b5f6&logo=ros&logoColor=000000)](https://github.com/fh1m/mongla_ws)
&nbsp;&nbsp;
[![Repositories](https://img.shields.io/badge/24_REPOSITORIES-ffffff?style=for-the-badge&labelColor=cfd8dc&color=cfd8dc&logo=github&logoColor=000000)](https://github.com/fh1m?tab=repositories)
</p>

</div>

## The record

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

> An ESC can report a perfectly respectable zero with nothing attached. A message count is not proof that a thruster is alive.

## Research, leadership, and field work

<sub>The surrounding work: research, competition systems, and engineering ownership.</sub>

[Underwater domain generalization](https://fh1m.github.io/about) · [field log](https://fh1m.github.io/log) · [competition work](https://fh1m.github.io/work) · [current direction](https://fh1m.github.io/now)

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

[Full record](https://fh1m.github.io/) · [About](https://fh1m.github.io/about) · [Repositories](https://github.com/fh1m?tab=repositories)

<sub>Dhaka, Bangladesh</sub>

</div>
