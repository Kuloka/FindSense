const { STATUSES } = require("../constants/statuses");

function blockedByAnalyzer(analyzer) {
  if (!analyzer) return null;
  if (analyzer.hasRateLimit) return STATUSES.RATE_LIMIT;
  if (analyzer.hasAntiBot || analyzer.hasTemporaryError || analyzer.hasWeakBody || analyzer.hasSuspiciousRedirect) {
    return STATUSES.MAYBE;
  }
  return null;
}

function resolveStatus({ proposedStatus, confirmations = [], analyzer = null }) {
  const blocked = blockedByAnalyzer(analyzer);

  if (blocked) {
    if (proposedStatus === STATUSES.TAKEN || proposedStatus === STATUSES.INVALID || proposedStatus === STATUSES.RESERVED) {
      return proposedStatus;
    }
    return blocked;
  }

  if (proposedStatus === STATUSES.FREE) {
    const uniqueConfirmations = new Set(confirmations);
    const hasExplicitMissing = uniqueConfirmations.has("explicit-not-found") || uniqueConfirmations.has("api-available");
    const hasCleanResponse = uniqueConfirmations.has("valid-local") && uniqueConfirmations.has("clean-response");
    return hasExplicitMissing && hasCleanResponse ? STATUSES.FREE : STATUSES.MAYBE;
  }

  return proposedStatus || STATUSES.UNKNOWN;
}

function makeParserResult({ parser, analyzer, signals = [], confirmations = [], proposedStatus }) {
  return {
    parser,
    proposedStatus,
    confirmations,
    analyzerSignals: analyzer?.signals || [],
    signals,
  };
}

module.exports = { resolveStatus, makeParserResult };
