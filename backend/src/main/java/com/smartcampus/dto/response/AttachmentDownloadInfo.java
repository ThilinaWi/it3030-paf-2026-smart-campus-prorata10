package com.smartcampus.dto.response;

import java.nio.file.Path;

public class AttachmentDownloadInfo {

    //  File path on the server (used to locate the file)
    private Path filePath;

    //  File name (used when downloading/displaying)
    private String fileName;

    // Default constructor
    public AttachmentDownloadInfo() {
    }

    // Constructor to set file path and file name
    public AttachmentDownloadInfo(Path filePath, String fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }

    // Getter for file path
    public Path getFilePath() {
        return filePath;
    }

    // Setter for file path
    public void setFilePath(Path filePath) {
        this.filePath = filePath;
    }

    // Getter for file name
    public String getFileName() {
        return fileName;
    }

    // Setter for file name
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}