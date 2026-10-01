### Fahim Faisal

Autonomy engineer. I build machines that perceive, reason, and act — underwater, in the air, and on the ground — and that have to work correctly when nobody is watching.

[fh1m.github.io](https://fh1m.github.io) · Dhaka, Bangladesh

---

**Now**

Lead autonomy engineer on [**Mongla**](https://github.com/fh1m/mongla_ws) — an independent ROS 2 stack for a 702mm AUV. 500 Hz control loop on a dedicated ESP32 core, Hailo-8 vision, right-invariant EKF for state estimation. Every shipped constant carries the method and conditions it was measured under; absent data renders as `--`, never as zero.

```
control   500 Hz   ESP32 core, isolated from the Pi
vision    Hailo-8   real-time detection, discrete failure states
state     EKF        right-invariant, fused IMU + vision + depth
bench     30 verified · 24 built, untested · 3 blocked · 0 in-water
```

**Shipped**

| | |
|---|---|
| [**Duburi**](https://github.com/fh1m/Duburi) | AUV platform — hull, hardware, control board |
| [**Dristy**](https://github.com/fh1m/Dristy) | K210 vision firmware, host API |
| [**mongla_ws**](https://github.com/fh1m/mongla_ws) | ROS 2 autonomy stack, full writeup on site |

**Record**

RoboSub 2025 — semifinals, Entrepreneurship award · University Rover Challenge 2025 — global top 10 · 2 peer-reviewed papers · 1,000+ commits on Mongla alone

**Stack**

Python, C, ROS 2, MAVLink, Hailo-8, ESP32/RISC-V, EKF/VSLAM

---

Reach me at fh1m.faisal.work@gmail.com. Longer writeups, failure logs, and retractions live at [fh1m.github.io](https://fh1m.github.io).
