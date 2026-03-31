declare global {
	interface Window {
		_p5Instance: p5 | undefined;
	}
}

import type p5 from 'p5';

export type Sketch = (sketch: p5) => void;
