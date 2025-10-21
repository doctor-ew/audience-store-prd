// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'whatwg-fetch';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.fetch = jest.fn();
