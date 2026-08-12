// Auto-split from the original public/js/data/subjects.js
// Subject: Operating System Concepts
const SUBJECT_S3_OS = {
  "id": "s3-os",
  "name": "Operating System Concepts",
  "code": "SLBSL-S3-P6",
  "exam": "",
  "color": "#A8DADC",
  "icon": "💻",
  "units": [
    {
      "id": "u1",
      "name": "Introduction to OS & Memory Management",
      "topics": [
        "What is Operating System? Types: batch system, time sharing, distributed, real time system",
        "Memory Management: Basic memory organization, single user contiguous scheme",
        "Fixed & dynamic partition, allocation & deallocation methods",
        "Concept of paging, page fault, fragmentation, segmentation",
        "Page replacement algorithms: FIFO, LRU",
        "Process concept, process states, process control block",
        "Scheduling criteria, process scheduling policies: FCFS, SJF, RR",
        "Concept of thread, switching"
      ]
    },
    {
      "id": "u2",
      "name": "Deadlock, Process Synchronization & I/O Management",
      "topics": [
        "What is deadlock? Cases for deadlock, conditions for deadlock",
        "Deadlock detection & recovery; deadlock prevention & avoidance",
        "Parallel processing, multiprocessing configurations",
        "Process synchronization, race condition, critical section, Semaphore",
        "IPC problems: producer-consumer/reader-writer problem, dining philosopher problem",
        "Principles of I/O devices, device controller, management of I/O request",
        "Device handler seek strategies/disk scheduling algorithms: FCFS, SSTF, Elevator"
      ]
    },
    {
      "id": "u3",
      "name": "Linux/Unix Commands & Shell Programming",
      "topics": [
        "What is kernel, shell?",
        "General purpose utility commands: cal, date, echo, bc, who, uname, tty, ps, kill, man, banner, passwd, clear, history",
        "File management commands: ls, cd, mkdir, rmdir, pwd, touch, file, cp, mv, rm, cat, more, head, tail",
        "vi editor, File permission commands, File system commands",
        "Shell scripting: variables, decision making (if-then-else, case), loops (while, until, for), functions"
      ]
    }
  ]
};
