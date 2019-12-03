import TapjawMessage from 'tapjaw-importer';

<% interfaces.forEach(function(interface){ %>interface <%- interface %> {};
<% }); %>

export default class <%- classname %>Message extends TapjawMessage {
    <% properties.forEach(function(property){ %>public <%- property %>;
    <% }); %>
}