const TRACKING_MODE = {
    'sot' : 'Track Specific Targets',
    'mot' : 'Detect and Track All Objects'
}

const ROI_THRESHOLD = 5;
const ALWAYES_PROCESS_RAW = true;

const TRUST_METHOD = {
    'detection': 'detection',
    'tracking': 'tracking'
}

const TRUST_MODE = {
    'offline': 'offline',
    'online': 'online'
}

const TRUST_VIEWMODE = {
    'detect': 'detect',
    'correct': 'correct'
}

export {
    TRACKING_MODE,
    TRUST_MODE,
    ROI_THRESHOLD,
    ALWAYES_PROCESS_RAW,
    TRUST_METHOD,
    TRUST_VIEWMODE
}