Real call recordings for /voice-agent-demo

Put one MP3 per agent line in the folder for each demo, named after the node id
in src/content/voice-demos.ts, for example:

  public/audio/demos/dental/greet.mp3
  public/audio/demos/dental/book.mp3
  public/audio/demos/restaurant/confirm730.mp3

Then set `hasRecordings: true` for that demo in src/content/voice-demos.ts.
Any missing file falls back to the browser voice automatically.
