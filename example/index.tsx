import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TextareaAutosize from '../src';
import { useRef, useState } from 'react';
import { getFormattedText } from '../src/getFormattedText';

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i);

const Basic = () => {
  return (
    <div>
      <TextareaAutosize
        maxRows={3}
        style={{
          lineHeight: 1,
          fontSize: 10,
          border: 0,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
};

const MinMaxRows = () => {
  return (
    <div>
      <h2>{'Component with maxRows and minRows'}</h2>
      <pre>
        {`
  <TextareaAutosize
    minRows={3}
    maxRows={6}
    defaultValue="Just a single line..."
    />
`}
      </pre>
      <TextareaAutosize
        minRows={3}
        maxRows={6}
        defaultValue="Just a single line..."
      />
    </div>
  );
};

const MinMaxRowsBorderBox = () => {
  return (
    <div>
      <h2>{'Component with maxRows and minRows (box-sizing: border-box)'}</h2>
      <pre>
        {`
  <TextareaAutosize
    style={{boxSizing: 'border-box'}}
    minRows={3}
    maxRows={6}
    defaultValue="Just a single line..."
    />
`}
      </pre>
      <TextareaAutosize
        style={{ boxSizing: 'border-box' }}
        minRows={3}
        maxRows={6}
        defaultValue="Just a single line..."
      />
    </div>
  );
};

const MaxRows = () => {
  return (
    <div>
      <h2>{'Component with maxRows'}</h2>
      <pre>
        {`
  <TextareaAutosize
    maxRows={5}
    defaultValue="Just a single line..."
    />
`}
      </pre>
      <TextareaAutosize maxRows={5} defaultValue="Just a single line..." />
    </div>
  );
};

const SetRows = () => {
  return (
    <div>
      <h2>{'Component with rows set'}</h2>
      <pre>
        {`
  <TextareaAutosize
    rows={4}
    defaultValue="Just a single line..."
    />
`}
      </pre>
      <TextareaAutosize rows={4} defaultValue="Just a single line..." />
    </div>
  );
};

const ControlledMode = () => {
  const [value, setValue] = React.useState(new Array(15).join('\nLine.'));
  return (
    <div>
      <h2>{'Controlled mode'}</h2>
      <pre>
        {`
  <TextareaAutosize
    cacheMeasurements
    value={value}
    onChange={ev => setValue(ev.target.value)}
    />
`}
      </pre>
      <TextareaAutosize
        cacheMeasurements
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
      />
      <button onClick={() => setValue('This value was set programatically')}>
        {'Change value programatically'}
      </button>
    </div>
  );
};

const UncontrolledMode = () => {
  return (
    <div>
      <h2>{'Uncontrolled mode'}</h2>
      <pre>
        {`
  <TextareaAutosize
    defaultValue={new Array(15).join('\nLine.')}
    />
`}
      </pre>
      <TextareaAutosize defaultValue={new Array(15).join('\nLine.')} />
    </div>
  );
};

const OnHeightChangeCallback = () => {
  const [value, setValue] = useState('');
    const [a, b] = useState(20);

  return (
    <div>
      <h2>{'Receive message on height change.'}</h2>
      <pre>
        {`
  <TextareaAutosize
    cacheMeasurements
    onHeightChange={(height) => console.log(height)}
    />
`}
      </pre>
      <TextareaAutosize
        maxHeight={60}
        style={{ fontSize: a }}
        onChange={(v) => {
          setValue(v);
            console.log(v);
        }}
        value={'testemkdm\nede\nd'}
      />
        <button onClick={() => {
            b(25)
        }}>ssss</button>
    </div>
  );
};

const MultipleTextareas = () => {
  const [value, setValue] = React.useState('');
  return (
    <div>
      <h2>{'Multiple textareas updated at the same time.'}</h2>
      <div>{'This one controls the rest.'}</div>
      <TextareaAutosize value={value} onChange={(ev) => setValue(ev)} />
      <div>{'Those get controlled by the one above.'}</div>
      {range(15).map((i) => (
        <TextareaAutosize key={i} value={value} />
      ))}
    </div>
  );
};

const Demo = () => {
  return (
    <div>
      <Basic />
      <MinMaxRows />
      <MinMaxRowsBorderBox />
      <MaxRows />
      <SetRows />
      <ControlledMode />
      <UncontrolledMode />
      <OnHeightChangeCallback />
      <MultipleTextareas />
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById('main'));
