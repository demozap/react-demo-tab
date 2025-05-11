import { useLocalStorage } from '@rehooks/local-storage';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import styleImgCSS from './img/css.png';
import codeImg from './img/jsx.png';
import styleImgSass from './img/sass.png';
import type { LocalStorage } from './types';
import type { DemoTabProps } from './types.public';

const localStorageKey = 'react-demo-tab';

export const DemoTab = ({ code, style, codeExt = 'jsx', styleExt = 'css', children }: DemoTabProps) => {
  const [tabIndex, setTabIndex] = useLocalStorage<LocalStorage>(localStorageKey, { mainTabIndex: 0, codeTabIndex: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const styleImg = styleExt === 'css' ? styleImgCSS : styleImgSass;

  return (
    <Tabs
      defaultIndex={tabIndex.mainTabIndex}
      onSelect={(index: number) => setTabIndex({ mainTabIndex: index, codeTabIndex: tabIndex.codeTabIndex })}
    >
      <TabList>
        <Tab>Demo</Tab>
        <Tab>Code</Tab>
      </TabList>
      <TabPanel className="tab-demo">{children}</TabPanel>
      <TabPanel className="tab-code" style={{ fontSize: '14px' }}>
        <Tabs
          defaultIndex={tabIndex.codeTabIndex}
          onSelect={(index: number) => setTabIndex({ mainTabIndex: tabIndex.mainTabIndex, codeTabIndex: index })}
        >
          <TabList>
            <Tab>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <img alt="code-img" height="30" src={codeImg} />
            </Tab>
            {style && (
              <Tab>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                <img alt="style-img" height="30" src={styleImg} />
              </Tab>
            )}
          </TabList>
          <TabPanel>
            <SyntaxHighlighter language={codeExt} showLineNumbers={true} style={prism}>
              {code}
            </SyntaxHighlighter>
          </TabPanel>
          {style && (
            <TabPanel>
              <SyntaxHighlighter language={styleExt} showLineNumbers={true} style={prism}>
                {style}
              </SyntaxHighlighter>
            </TabPanel>
          )}
        </Tabs>
      </TabPanel>
    </Tabs>
  );
};
