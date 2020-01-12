# ministun

STUN is a simple protocol. A STUN implementation should be simple too.

ministun is a **zero dependency** STUN server. It implements "Basic Server Behavior"<sup>&ast;</sup> as defined by [section 13](https://tools.ietf.org/html/rfc5389#section-13) of [RFC 5389](https://tools.ietf.org/html/rfc5389), including backwards compatibility with [RFC 3489](https://tools.ietf.org/html/rfc3489). Originally developed for integration with peer-to-peer applications over WebRTC, ministun lets you add STUN services to whatever you're building.

ministun is deployed as a standalone public STUN server here: *stun.noahlevenson.com:3478*

In the future, ministun could evolve to provide a more robust implementation of [RFC 5389](https://tools.ietf.org/html/rfc5389), including client functions.

<sup>&ast;</sup> Since ministun is focused on STUN services for WebRTC, it doesn't currently support STUN over TCP. (Chrome and Firefox only implement STUN for WebRTC over UDP).