package com.smartcampus.dto.response;

import java.nio.file.Path;

public class AttachmentDownloadInfo {

    private Path filePath;
    private String fileName;

    public AttachmentDownloadInfo() {
    }

    public AttachmentDownloadInfo(Path filePath, String fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }

    public Path getFilePath() {
        return filePath;
    }

    public void setFilePath(Path filePath) {
        this.filePath = filePath;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
