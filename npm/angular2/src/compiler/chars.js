'use strict';"use strict";
exports.$EOF = 0;
exports.$TAB = 9;
exports.$LF = 10;
exports.$VTAB = 11;
exports.$FF = 12;
exports.$CR = 13;
exports.$SPACE = 32;
exports.$BANG = 33;
exports.$DQ = 34;
exports.$HASH = 35;
exports.$$ = 36;
exports.$PERCENT = 37;
exports.$AMPERSAND = 38;
exports.$SQ = 39;
exports.$LPAREN = 40;
exports.$RPAREN = 41;
exports.$STAR = 42;
exports.$PLUS = 43;
exports.$COMMA = 44;
exports.$MINUS = 45;
exports.$PERIOD = 46;
exports.$SLASH = 47;
exports.$COLON = 58;
exports.$SEMICOLON = 59;
exports.$LT = 60;
exports.$EQ = 61;
exports.$GT = 62;
exports.$QUESTION = 63;
exports.$0 = 48;
exports.$9 = 57;
exports.$A = 65;
exports.$E = 69;
exports.$Z = 90;
exports.$LBRACKET = 91;
exports.$BACKSLASH = 92;
exports.$RBRACKET = 93;
exports.$CARET = 94;
exports.$_ = 95;
exports.$a = 97;
exports.$e = 101;
exports.$f = 102;
exports.$n = 110;
exports.$r = 114;
exports.$t = 116;
exports.$u = 117;
exports.$v = 118;
exports.$z = 122;
exports.$LBRACE = 123;
exports.$BAR = 124;
exports.$RBRACE = 125;
exports.$NBSP = 160;
exports.$PIPE = 124;
exports.$TILDA = 126;
exports.$AT = 64;
function isWhitespace(code) {
    return (code >= exports.$TAB && code <= exports.$SPACE) || (code == exports.$NBSP);
}
exports.isWhitespace = isWhitespace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLXI1UHJKSzloLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvY2hhcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFhLFlBQUksR0FBc0IsQ0FBQyxDQUFDO0FBQzVCLFlBQUksR0FBc0IsQ0FBQyxDQUFDO0FBQzVCLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLGFBQUssR0FBc0IsRUFBRSxDQUFDO0FBQzlCLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLGNBQU0sR0FBc0IsRUFBRSxDQUFDO0FBQy9CLGFBQUssR0FBc0IsRUFBRSxDQUFDO0FBQzlCLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLGFBQUssR0FBc0IsRUFBRSxDQUFDO0FBQzlCLFVBQUUsR0FBc0IsRUFBRSxDQUFDO0FBQzNCLGdCQUFRLEdBQXNCLEVBQUUsQ0FBQztBQUNqQyxrQkFBVSxHQUFzQixFQUFFLENBQUM7QUFDbkMsV0FBRyxHQUFzQixFQUFFLENBQUM7QUFDNUIsZUFBTyxHQUFzQixFQUFFLENBQUM7QUFDaEMsZUFBTyxHQUFzQixFQUFFLENBQUM7QUFDaEMsYUFBSyxHQUFzQixFQUFFLENBQUM7QUFDOUIsYUFBSyxHQUFzQixFQUFFLENBQUM7QUFDOUIsY0FBTSxHQUFzQixFQUFFLENBQUM7QUFDL0IsY0FBTSxHQUFzQixFQUFFLENBQUM7QUFDL0IsZUFBTyxHQUFzQixFQUFFLENBQUM7QUFDaEMsY0FBTSxHQUFzQixFQUFFLENBQUM7QUFDL0IsY0FBTSxHQUFzQixFQUFFLENBQUM7QUFDL0Isa0JBQVUsR0FBc0IsRUFBRSxDQUFDO0FBQ25DLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLFdBQUcsR0FBc0IsRUFBRSxDQUFDO0FBQzVCLGlCQUFTLEdBQXNCLEVBQUUsQ0FBQztBQUVsQyxVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUMzQixVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUUzQixVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUMzQixVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUMzQixVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUUzQixpQkFBUyxHQUFzQixFQUFFLENBQUM7QUFDbEMsa0JBQVUsR0FBc0IsRUFBRSxDQUFDO0FBQ25DLGlCQUFTLEdBQXNCLEVBQUUsQ0FBQztBQUNsQyxjQUFNLEdBQXNCLEVBQUUsQ0FBQztBQUMvQixVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUUzQixVQUFFLEdBQXNCLEVBQUUsQ0FBQztBQUMzQixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUM1QixVQUFFLEdBQXNCLEdBQUcsQ0FBQztBQUU1QixlQUFPLEdBQXNCLEdBQUcsQ0FBQztBQUNqQyxZQUFJLEdBQXNCLEdBQUcsQ0FBQztBQUM5QixlQUFPLEdBQXNCLEdBQUcsQ0FBQztBQUNqQyxhQUFLLEdBQXNCLEdBQUcsQ0FBQztBQUUvQixhQUFLLEdBQXNCLEdBQUcsQ0FBQztBQUMvQixjQUFNLEdBQXNCLEdBQUcsQ0FBQztBQUNoQyxXQUFHLEdBQXNCLEVBQUUsQ0FBQztBQUV6QyxzQkFBNkIsSUFBWTtJQUN2QyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksWUFBSSxJQUFJLElBQUksSUFBSSxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxhQUFLLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRmUsb0JBQVksZUFFM0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCAkRU9GID0gLypAdHMyZGFydF9jb25zdCovIDA7XG5leHBvcnQgY29uc3QgJFRBQiA9IC8qQHRzMmRhcnRfY29uc3QqLyA5O1xuZXhwb3J0IGNvbnN0ICRMRiA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMDtcbmV4cG9ydCBjb25zdCAkVlRBQiA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMTtcbmV4cG9ydCBjb25zdCAkRkYgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMTI7XG5leHBvcnQgY29uc3QgJENSID0gLypAdHMyZGFydF9jb25zdCovIDEzO1xuZXhwb3J0IGNvbnN0ICRTUEFDRSA9IC8qQHRzMmRhcnRfY29uc3QqLyAzMjtcbmV4cG9ydCBjb25zdCAkQkFORyA9IC8qQHRzMmRhcnRfY29uc3QqLyAzMztcbmV4cG9ydCBjb25zdCAkRFEgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMzQ7XG5leHBvcnQgY29uc3QgJEhBU0ggPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMzU7XG5leHBvcnQgY29uc3QgJCQgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMzY7XG5leHBvcnQgY29uc3QgJFBFUkNFTlQgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMzc7XG5leHBvcnQgY29uc3QgJEFNUEVSU0FORCA9IC8qQHRzMmRhcnRfY29uc3QqLyAzODtcbmV4cG9ydCBjb25zdCAkU1EgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMzk7XG5leHBvcnQgY29uc3QgJExQQVJFTiA9IC8qQHRzMmRhcnRfY29uc3QqLyA0MDtcbmV4cG9ydCBjb25zdCAkUlBBUkVOID0gLypAdHMyZGFydF9jb25zdCovIDQxO1xuZXhwb3J0IGNvbnN0ICRTVEFSID0gLypAdHMyZGFydF9jb25zdCovIDQyO1xuZXhwb3J0IGNvbnN0ICRQTFVTID0gLypAdHMyZGFydF9jb25zdCovIDQzO1xuZXhwb3J0IGNvbnN0ICRDT01NQSA9IC8qQHRzMmRhcnRfY29uc3QqLyA0NDtcbmV4cG9ydCBjb25zdCAkTUlOVVMgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gNDU7XG5leHBvcnQgY29uc3QgJFBFUklPRCA9IC8qQHRzMmRhcnRfY29uc3QqLyA0NjtcbmV4cG9ydCBjb25zdCAkU0xBU0ggPSAvKkB0czJkYXJ0X2NvbnN0Ki8gNDc7XG5leHBvcnQgY29uc3QgJENPTE9OID0gLypAdHMyZGFydF9jb25zdCovIDU4O1xuZXhwb3J0IGNvbnN0ICRTRU1JQ09MT04gPSAvKkB0czJkYXJ0X2NvbnN0Ki8gNTk7XG5leHBvcnQgY29uc3QgJExUID0gLypAdHMyZGFydF9jb25zdCovIDYwO1xuZXhwb3J0IGNvbnN0ICRFUSA9IC8qQHRzMmRhcnRfY29uc3QqLyA2MTtcbmV4cG9ydCBjb25zdCAkR1QgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gNjI7XG5leHBvcnQgY29uc3QgJFFVRVNUSU9OID0gLypAdHMyZGFydF9jb25zdCovIDYzO1xuXG5leHBvcnQgY29uc3QgJDAgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gNDg7XG5leHBvcnQgY29uc3QgJDkgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gNTc7XG5cbmV4cG9ydCBjb25zdCAkQSA9IC8qQHRzMmRhcnRfY29uc3QqLyA2NTtcbmV4cG9ydCBjb25zdCAkRSA9IC8qQHRzMmRhcnRfY29uc3QqLyA2OTtcbmV4cG9ydCBjb25zdCAkWiA9IC8qQHRzMmRhcnRfY29uc3QqLyA5MDtcblxuZXhwb3J0IGNvbnN0ICRMQlJBQ0tFVCA9IC8qQHRzMmRhcnRfY29uc3QqLyA5MTtcbmV4cG9ydCBjb25zdCAkQkFDS1NMQVNIID0gLypAdHMyZGFydF9jb25zdCovIDkyO1xuZXhwb3J0IGNvbnN0ICRSQlJBQ0tFVCA9IC8qQHRzMmRhcnRfY29uc3QqLyA5MztcbmV4cG9ydCBjb25zdCAkQ0FSRVQgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gOTQ7XG5leHBvcnQgY29uc3QgJF8gPSAvKkB0czJkYXJ0X2NvbnN0Ki8gOTU7XG5cbmV4cG9ydCBjb25zdCAkYSA9IC8qQHRzMmRhcnRfY29uc3QqLyA5NztcbmV4cG9ydCBjb25zdCAkZSA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMDE7XG5leHBvcnQgY29uc3QgJGYgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMTAyO1xuZXhwb3J0IGNvbnN0ICRuID0gLypAdHMyZGFydF9jb25zdCovIDExMDtcbmV4cG9ydCBjb25zdCAkciA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMTQ7XG5leHBvcnQgY29uc3QgJHQgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMTE2O1xuZXhwb3J0IGNvbnN0ICR1ID0gLypAdHMyZGFydF9jb25zdCovIDExNztcbmV4cG9ydCBjb25zdCAkdiA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMTg7XG5leHBvcnQgY29uc3QgJHogPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMTIyO1xuXG5leHBvcnQgY29uc3QgJExCUkFDRSA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMjM7XG5leHBvcnQgY29uc3QgJEJBUiA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMjQ7XG5leHBvcnQgY29uc3QgJFJCUkFDRSA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMjU7XG5leHBvcnQgY29uc3QgJE5CU1AgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMTYwO1xuXG5leHBvcnQgY29uc3QgJFBJUEUgPSAvKkB0czJkYXJ0X2NvbnN0Ki8gMTI0O1xuZXhwb3J0IGNvbnN0ICRUSUxEQSA9IC8qQHRzMmRhcnRfY29uc3QqLyAxMjY7XG5leHBvcnQgY29uc3QgJEFUID0gLypAdHMyZGFydF9jb25zdCovIDY0O1xuXG5leHBvcnQgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKGNvZGUgPj0gJFRBQiAmJiBjb2RlIDw9ICRTUEFDRSkgfHwgKGNvZGUgPT0gJE5CU1ApO1xufVxuIl19