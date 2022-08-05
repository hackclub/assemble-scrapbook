const Flag = props => (
  <a
    title="Hack Club - Assemble"
    href="https://assemble.hackclub.com/"
    className="nav-flag"
    {...props}
  >
    <style jsx>{`
      a {
        display: inline-block;
        background-image: url(https://assemble.hackclub.com/favicon.png);
        background-repeat: no-repeat;
        background-position: top left;
        background-size: contain;
        cursor: pointer;
        flex-shrink: 0;
        width: 112px;
        height: 48px;
        margin-top: 12px;
      }
      @media (min-width: 32em) {
        a {
          height: 64px;
        }
      }
    `}</style>
  </a>
)

export default Flag
