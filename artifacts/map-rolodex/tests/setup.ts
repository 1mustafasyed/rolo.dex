// jsdom has CSS animation properties but no AnimationEvent constructor. React
// otherwise registers prefixed events, unlike the real browsers being tested.
Object.defineProperty(window, 'AnimationEvent', {
  value: class AnimationEvent extends Event {
    animationName: string;
    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init);
      this.animationName = init.animationName ?? '';
    }
  },
});