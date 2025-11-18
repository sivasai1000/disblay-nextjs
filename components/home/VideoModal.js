export default function VideoModal() {
  return (
    <div
      className="modal fade"
      id="videoModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">How It Works</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-0">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
