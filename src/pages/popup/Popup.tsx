import React from 'react';
import logo from '@assets/img/logo.svg';
import { Button } from '@src/components/ui/button';

export default function Popup() {
  const handleClick = async () => {
    let panel = browser.runtime.getURL("/src/pages/panel/index.html")
    browser.sidebarAction.setPanel({ panel: panel });
    browser.sidebarAction.open()
  };

  return (
    <div className="">
      <Button
        onClick={handleClick}
      >Click me</Button>
    </div>
  );
}
